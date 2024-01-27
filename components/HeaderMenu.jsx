import { IoSettingsOutline } from "react-icons/io5";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";


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

import { LogoutButton } from './auth/logout-button';

const HeaderMenu = ({ user }) => {
  const router = useRouter();

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage src={user?.image || ""}/>
            <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
            from-green-400 to-green-800">
              <FaUser className="text-white"/>
            </AvatarFallback>
          </Avatar>
          {user.name}
        </div>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem className="cursor-pointer flex items-center text-base" onClick={() => handleNavigation('/users')}>
          <IoHomeOutline className="h-6 w-6 mr-2" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-base" onClick={() => handleNavigation('/users/account')}>
          <IoPersonOutline className="h-6 w-6 mr-2" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-base" onClick={() => handleNavigation('/users/create-post')}>
          <IoChatboxEllipsesOutline className="h-6 w-6 mr-2" />
          Create Post
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-base" onClick={() => handleNavigation('/settings')}>
          <IoSettingsOutline className="h-6 w-6 mr-2" />
          Settings
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="text-base cursor-pointer">
            <IoExitOutline className="h-6 w-6 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenu;
