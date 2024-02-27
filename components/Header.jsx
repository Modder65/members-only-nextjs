'use client'

import { UserSkeleton } from "./UserSkeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import HeaderMenu from "./HeaderMenu";
import Link from "next/link";

export function Header() {
  const user = useCurrentUser();

  return (
    <header className="bg-white py-4 flex justify-center shadow">
      <div className="
        header-container 
        w-full 
        max-w-3xl 
        flex
        flex-col 
        items-center  
        justify-center
        gap-2
        px-4
        sm:flex-row 
        sm:justify-between
        sm:gap-0
      ">
        <div className="header-title-container">
          <h1 className="text-3xl font-bold">
            <Link href="/users">
              <span className="text-skin-header hover:text-skin-link-accent-hover">Members</span>
              <span className="text-black hover:text-skin-link-accent-hover">Only</span>
            </Link>
          </h1>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex flex-row-reverse justify-center items-center">
              <HeaderMenu user={user} />
            </div>
          ) : (
            <UserSkeleton />
          )}
        </div>
      </div>
    </header>
  );
}
