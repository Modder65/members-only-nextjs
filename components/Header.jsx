'use client'

import { UserSkeleton } from "./UserSkeleton";
import HeaderMenu from "./HeaderMenu";
import { useCurrentUser } from "@/hooks/use-current-user";

export function Header() {
  const user = useCurrentUser();

  return (
    <header className="bg-white py-4 flex justify-center shadow">
      <div className="header-container w-full max-w-3xl flex justify-between items-center px-4">
        <div className="header-title-container">
          <h1 className="text-3xl font-bold">
            <span className="text-skin-header">Members</span>
            <span className="text-black">Only</span>
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
