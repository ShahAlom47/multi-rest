/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getUserCollection, getTenantCollection } from "@/lib/database/db_collections";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Email and password required");

        const usersCollection = await getUserCollection();
        const tenantsCollection = await getTenantCollection();

        // 1️⃣ Find user by email
        const user = await usersCollection.findOne({ email: credentials.email });
        if (!user) throw new Error("No account found with this email");

        // 2️⃣ Super Admin login (tenantId not needed)
        if (user.role === "super_admin") {
          const isValid = await bcrypt.compare(credentials.password, user.password || "");
          if (!isValid) throw new Error("Incorrect password");
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: "super_admin",
            tenantId: null,
            verified: user.verified,
            image: user.image || null,
          };
        }

        // 3️⃣ Normal user/Admin login → validate tenant
        if (!user.tenantId) throw new Error("Invalid tenant");
        const tenant = await tenantsCollection.findOne({ tenantId: user.tenantId });
        if (!tenant) throw new Error("Invalid tenant");

        const isValid = await bcrypt.compare(credentials.password, user.password || "");
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image || null,
          verified: user.verified,
          tenantId: tenant.tenantId,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.name = u.name;
        token.email = u.email;
        token.role = u.role;
        token.image = u.image ?? null;
        token.verified = u.verified ?? false;
        token.tenantId = u.tenantId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name ?? null,
        email: token.email ?? null,
        role: token.role ?? "user",
        image: token.image ?? null,
        verified: token.verified ?? false,
        tenantId: token.tenantId ?? null,
      } as any;
      return session;
    },
  },

  pages: { signIn: "/login", error: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
