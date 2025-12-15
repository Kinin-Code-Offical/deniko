import { DefaultSession } from "next-auth";
import { Role } from "@deniko/db";

declare module "next-auth" {
  interface Session {
    user: {
      role?: Role;
      isOnboardingCompleted: boolean;
      username?: string;
      avatarVersion?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    isOnboardingCompleted: boolean;
    username?: string;
    avatarVersion?: number;
  }
}
