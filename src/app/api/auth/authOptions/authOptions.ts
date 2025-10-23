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
  async authorize(credentials, req) {
    if (!credentials?.email || !credentials?.password)
      throw new Error("Email and password required");

    const usersCollection = await getUserCollection();
    const tenantsCollection = await getTenantCollection();

    // 🌐 বর্তমান ডোমেইন ধরো
    const host = req?.headers?.host; // যেমন "rest1.orders.com"
   
    if (!host) throw new Error("Invalid request host");

    // 🔍 এই ডোমেইন অনুযায়ী tenant খুঁজে বের করো
    const tenant = await tenantsCollection.findOne({ domain: host });
 
    if (!tenant) throw new Error("Unknown tenant");

    // 🧍‍♂️ user খুঁজে বের করো
    const user = await usersCollection.findOne({ email: credentials.email });
    if (!user) throw new Error("No account found with this email");

    // 🚫 Super admin না হলে domain mismatch check করো
    if (user.role !== "super_admin" && user.tenantId !== tenant.tenantId) {
      throw new Error("You are not authorized to log in from this domain");
    }

    // 🔑 Password check
    const isValid = await bcrypt.compare(credentials.password, user.password || "");
    if (!isValid) throw new Error("Incorrect password");

    // ✅ সফল হলে return করো
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: tenant.tenantId,
      image: user.image || null,
      verified: user.verified,
    };
  },
})
,
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
