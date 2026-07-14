import type { AdminSection, UserRole } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      permissions: AdminSection[];
    };
  }

  interface User {
    role: UserRole;
    permissions: AdminSection[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    permissions: AdminSection[];
  }
}
