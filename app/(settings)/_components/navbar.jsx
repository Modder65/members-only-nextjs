"use client"

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();

  // Check if the user's role is "OWNER" or "ADMIN"
  const isAdminOrOwner = user?.role === "OWNER" || user?.role === "ADMIN";
  const isOwner = user?.role === "OWNER";
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="bg-secondary flex justify-between
     items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
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
      </div>
      <UserButton />
    </nav>
  );
}