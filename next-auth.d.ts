import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isBlacklisted: boolean;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    emailVerified: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    isBlacklisted?: boolean;
    emailVerified?: Date | null;
    last_synced?: number;
  }
}