import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getUserCollection, getTenantCollection } from "@/lib/database/db_collections";

// ==========================
// MongoDB User Interface
// ==========================
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string | null;
  passwordHash: string;
  image?: string | null;
  verified: boolean;
  createdAt?: string;
}

// ==========================
// NextAuth Type Extensions
// ==========================
declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    verified?: boolean;
    image?: string | null;
    tenantId?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      image?: string | null;
      verified?: boolean;
      tenantId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    image?: string | null;
    verified?: boolean;
    tenantId?: string | null;
  }
}

// ============================
// 🔐 AUTH OPTIONS
// ============================
export const authOptions: NextAuthOptions = {
  providers: [
    // ----------------------------
    // Credentials Provider
    // ----------------------------
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantKey: { label: "Tenant Slug", type: "text" }, // optional for super-admin
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const usersCollection = await getUserCollection();
        const tenantsCollection = await getTenantCollection();

        // 🔹 Super Admin login (tenant not required)
        if (!credentials.tenantKey) {
          const superAdmin = await usersCollection.findOne({
            email: credentials.email,
            role: "super-admin",
          });
          if (!superAdmin) throw new Error("Tenant is required for normal users.");

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            superAdmin.passwordHash
          );
          if (!isPasswordValid) throw new Error("Incorrect password.");

          return {
            id: superAdmin._id.toString(),
            name: superAdmin.name,
            email: superAdmin.email,
            role: "super-admin",
            tenantId: null,
            verified: superAdmin.verified,
            image: superAdmin.image || null,
          };
        }

        // 🔹 Normal user login
        const tenant = await tenantsCollection.findOne({ slug: credentials.tenantKey });
        if (!tenant) throw new Error("Invalid tenant.");

        const user = await usersCollection.findOne({
          email: credentials.email,
          tenantId: tenant._id.toString(),
        });
        if (!user) throw new Error("No account found for this email in this tenant.");

        if (!user.verified) throw new Error("Email not verified.");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) throw new Error("Incorrect password.");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image || null,
          verified: user.verified,
          tenantId: tenant._id.toString(),
        };
      },
    }),

    // ----------------------------
    // Google OAuth Provider
    // ----------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account }) {
      const usersCollection = await getUserCollection();

      if (account?.provider === "google") {
        if (!user.email) throw new Error("Google account has no email.");

        // Assign default tenant if needed
        const defaultTenant = await getTenantCollection().findOne({ slug: "default" });
        const tenantId = defaultTenant?._id.toString() ?? null;

        const existingUser = await usersCollection.findOne({
          email: user.email,
          tenantId: tenantId,
        });

        if (!existingUser) {
          await usersCollection.insertOne({
            
            name: user.name || "",
            email: user.email,
            role: "user",
            image: user.image || null,
            verified: true,
            tenantId,
            createdAt: new Date().toISOString(),
            passwordHash: "", // empty for OAuth users
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image ?? null;
        token.verified = user.verified ?? false;
        token.tenantId = user.tenantId ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name ?? null;
      session.user.email = token.email ?? null;
      session.user.role = token.role ?? "user";
      session.user.image = token.image ?? null;
      session.user.verified = token.verified ?? false;
      session.user.tenantId = token.tenantId ?? null;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
