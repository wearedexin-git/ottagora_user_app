import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const isProd = process.env.NODE_ENV === "production";
const cookiePrefix = isProd ? "__Secure-" : "";

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

        const email = String(credentials.email).trim().toLowerCase();

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              role: "USER",
              userType: "PRIVATE",
              name: email.split("@")[0],
            },
          });
        }

        if (user.archived) return null;

        if (user.role !== "USER") {
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
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}ottagora.ua.session-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: isProd },
    },
    callbackUrl: {
      name: `${cookiePrefix}ottagora.ua.callback-url`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: isProd },
    },
    csrfToken: {
      name: `${cookiePrefix}ottagora.ua.csrf-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: isProd },
    },
  },
});
