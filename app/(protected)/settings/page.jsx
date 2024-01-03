"use client"

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

const SettingsPage = () => {
  const user = useCurrentUser();

  const onClick = () => {
    logout();
  };

  return ( 
    <div className="bg-white p-10 rounded-xl flex flex-col gap-y-5">
      <button onClick={onClick}>
        Sign Out
      </button>
      <Button
        asChild
        variant="default"
      >
        <Link href="/users">
          Users
        </Link>
      </Button>
    </div>
   );
}
 
export default SettingsPage;