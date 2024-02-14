"use client";

import { FaUser } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { useRouter } from "next/navigation";

export const UserButton = () => {
  const router = useRouter();
  const user = useCurrentUser();

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""}/>
          <AvatarFallback>
            <FaUser className="text-white"/>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigation('/users')}>
          <IoPeopleOutline className="h-5 w-5 mr-2" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigation('/users/account')}>
          <IoPersonOutline className="h-5 w-5 mr-2" />
          Account
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <IoExitOutline className="h-5 w-5 mr-2"/>
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}