import { FaRegSun } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaHouseUser } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage src={user?.image || ""}/>
            <AvatarFallback>
              <FaUser className="text-white"/>
            </AvatarFallback>
          </Avatar>
          {user.name}
        </div>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem className="cursor-pointer flex items-center text-lg" onClick={() => handleNavigation('/users')}>
          <FaHouseUser className="h-5 w-5 mr-2" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-lg" onClick={() => handleNavigation('/users/account')}>
          <FaRegUser className="h-5 w-5 mr-2" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-lg" onClick={() => handleNavigation('/users/create-post')}>
          <FaRegCommentDots className="h-5 w-5 mr-2" />
          Create Post
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-lg" onClick={() => handleNavigation('/settings')}>
          <FaRegSun className="h-5 w-5 mr-2" />
          Settings
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="text-lg cursor-pointer">
            <FaRegShareSquare className="h-5 w-5 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenu;
