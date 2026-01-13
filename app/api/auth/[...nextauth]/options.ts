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
          role: user.role,
          emailVerified: user.emailVerified ?? null,
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
        session.user.emailVerified = token.emailVerified ?? null;
        session.user.isBlacklisted = token.isBlacklisted as boolean;
      }
      return session;
    }
    ,
    async jwt({ token, user }) {
      // Sync user data TTL
      const now = Date.now();
      if (!token.last_synced || now - token.last_synced > 5 * 60 * 1000) { // 5 minutes
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub! },
        select: { isBlacklisted: true, role: true, emailVerified: true },
      });
      if (dbUser) {
        token.isBlacklisted = dbUser.isBlacklisted;
        token.role = dbUser.role;
        token.emailVerified = dbUser.emailVerified ?? null;
      }
      token.last_synced = now;
    }
      // On first login
      if (user) {
        token.sub = user.id;
        token.role= user.role? user.role : "USER";
        token.emailVerified= user.emailVerified ?? null;
        token.role = user.role ? user.role : "USER";
        token.last_synced = now;

        // Fetch blacklist status
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isBlacklisted: true },
        });

        token.isBlacklisted = dbUser?.isBlacklisted ?? false;
      }

      return token;
    }
    ,
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
