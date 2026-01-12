import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // Email and Password Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!valid) {
          throw new Error("Invalid email or password");
        }

        //Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // To link Google accounts with existing emails
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role= user.role? user.role : "USER";
      }
      return token;
    },
    async signIn({ user, account }) {
    if (account?.provider === "google") {
      await prisma.user.upsert({
        where: { email: user.email! },
        update: {
          emailVerified: new Date(),
        },
        create: {
          email: user.email!,
          emailVerified: new Date(),
          name: user.name!,
          passwordHash: null,
          role: "USER",
          image: user.image!,
        },
      });
    }
    return true;
  },
  },

  pages: {
    signIn: "/login",
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
