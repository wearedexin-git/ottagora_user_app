import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email as string;

        // Trova o crea l'utente mock in base all'email (come da specifica del back-office)
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          let role = "USER";
          if (email.includes("admin")) role = "SUPERADMIN";
          else if (email.includes("host")) role = "HOST_MANAGER";
          else if (email.includes("restaurant")) role = "RESTAURANT_MANAGER";
          else if (email.includes("training")) role = "TRAINING_MANAGER";
          else if (email.includes("teacher")) role = "TEACHER";
          else if (email.includes("event")) role = "EVENT_MANAGER";

          user = await prisma.user.create({
            data: {
              email,
              role,
              type: "PRIVATE",
              name: email.split("@")[0],
            },
          });
        }

        if (user.archived) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
