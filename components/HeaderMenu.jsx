import { IoIosSettings } from "react-icons/io";
import { BiMessageAltDetail } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/features/friendsModalSlice";
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

  const dispatch = useDispatch();

  const openModalHandler = async () => {
    dispatch(openModal());
  }

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
          <AiOutlineHome className="h-6 w-6 mr-2"/>
          Home
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-base" onClick={() => handleNavigation('/users/account')}>
          <BsPerson className="h-6 w-6 mr-2"/>
          Account
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-base" onClick={openModalHandler}>
          <SlPeople className="h-6 w-6 mr-2"/>
          Friends
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-base" onClick={() => handleNavigation('/users/create-post')}>
          <BiMessageAltDetail className="h-6 w-6 mr-2"/>
          Create Post
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center text-base" onClick={() => handleNavigation('/settings')}>
          <IoIosSettings className="h-6 w-6 mr-2"/>
          Settings
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="text-base cursor-pointer">
            <ExitIcon className="h-6 w-6 mr-2"/>
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenu;
