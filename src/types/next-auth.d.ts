import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatarUrl: string;
      role: string;
    } & DefaultSession["user"];
    accessToken: string;
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    expTime: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }
}
