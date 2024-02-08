"use client"

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();

  // Check if the user's role is "OWNER" or "ADMIN"
  const isAdminOrOwner = user?.role === "OWNER" || user?.role === "ADMIN";
  const isOwner = user?.role === "OWNER";
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="max-w-3xl w-full mx-auto bg-secondary flex justify-center gap-x-2.5
     items-center p-4 rounded-xl shadow-sm">
      <Button
        asChild
        variant={pathname === "/server" ? "default" : "outline"}
      >
        <Link href="/server">
          Server
        </Link>
      </Button>
      <Button
        asChild
        variant={pathname === "/client" ? "default" : "outline"}
      >
        <Link href="/client">
          Client
        </Link>
      </Button>
      {isOwner && (
        <Button
          asChild
          variant={pathname === "/owner" ? "default" : "outline"}
        >
          <Link href="/owner">
            Owner
          </Link>
        </Button>
      )}
      {isAdminOrOwner && (
        <Button
          asChild
          variant={pathname === "/manage-users" ? "default" : "outline"}
        >
          <Link href="/manage-users">
            Manage Users
          </Link>
        </Button>
      )}
      <Button
        asChild
        variant={pathname === "/settings" ? "default" : "outline"}
      >
        <Link href="/settings">
          Settings
        </Link>
      </Button>
    </nav>
  );
}