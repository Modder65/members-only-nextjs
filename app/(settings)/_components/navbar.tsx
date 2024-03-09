"use client"

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

export const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();

  // Check if the user's role is "OWNER" or "ADMIN"
  const isAdminOrOwner = user?.role === "OWNER" || user?.role === "ADMIN";
  const isOwner = user?.role === "OWNER";

  return (
    <nav className="max-w-3xl w-full mx-auto bg-white flex justify-center gap-x-2.5 gap-y-2
    items-center p-4 rounded-xl shadow-sm flex-wrap">
      <Button
        className="w-20"
        asChild
        variant={pathname === "/settings" ? "default" : "outline"}
      >
        <Link href="/settings">
          Settings
        </Link>
      </Button>
      <Button
        className="w-20"
        asChild
        variant={pathname === "/themes" ? "default" : "outline"}
      >
        <Link href="/themes">
          Themes
        </Link>
      </Button>
      {isOwner && (
        <Button
          className="w-20"
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
          className="w-20"
          asChild
          variant={pathname === "/manage-users" ? "default" : "outline"}
        >
          <Link href="/manage-users">
            Users
          </Link>
        </Button>
      )}
    </nav>
  );
}