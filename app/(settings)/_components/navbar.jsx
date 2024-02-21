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
    <nav className="max-w-3xl w-full mx-auto bg-white flex justify-center gap-x-2.5
     items-center p-4 rounded-xl shadow-sm">
      <Button
        asChild
        variant={pathname === "/settings" ? "default" : "outline"}
      >
        <Link href="/settings">
          Settings
        </Link>
      </Button>
      <Button
        asChild
        variant={pathname === "/themes" ? "default" : "outline"}
      >
        <Link href="/themes">
          Themes
        </Link>
      </Button>
      {isOwner && (
        <Button
          asChild
          variant={pathname === "/invite" ? "default" : "outline"}
        >
          <Link href="/invite">
            Invite
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
    </nav>
  );
}