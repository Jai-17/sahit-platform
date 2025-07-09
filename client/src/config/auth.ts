/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        try {
          const res = await axios.post(
            `${process.env.BACKEND_URL}/api/v1/auth/signin`,
            { email: credentials?.email, password: credentials?.password }
          );
          console.log("Response from backend:", res.data);
          const user = res.data;
          if (!user) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isOnboarded: user.isOnboarded,
          };
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User;
        token.id = u.id;
        token.role = u.role;
        token.isOnboarded = u.isOnboarded;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).isOnboarded = token.isOnboarded as boolean;
      }
      return session;
    },

    async signIn({ account, user }) {
      if (account?.provider === "google") {
        await axios.post(`${process.env.BACKEND_URL}/api/v1/auth/oauth-sync`, {
          email: user.email,
          name: user.name,
        });
      }
      return true;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/auth-error",
  },

  secret: process.env.AUTH_SECRET,
});
