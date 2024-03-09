import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: 'OWNER' | 'ADMIN' | 'USER' | 'BANNED';
      isTwoFactorEnabled: boolean;
      name: string;
      email: string;
      createdAt: Date;
      image?: string;
    }
  }

  interface User {
    id: string;
    role: 'OWNER' | 'ADMIN' | 'USER' | 'BANNED';
    isTwoFactorEnabled: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: 'OWNER' | 'ADMIN' | 'USER' | 'BANNED';
    isTwoFactorEnabled: boolean;
    name: string;
    email: string;
    image?: string;
  }
}