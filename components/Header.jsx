'use client'

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import Avatar from "@/app/users/components/Avatar";
import { UserSkeleton } from "./UserSkeleton";

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoggedIn = session !== null;
  console.log("Is logged in:", isLoggedIn, "Session data:", session);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    signOut();
    router.push('/');
    console.log("Is logged in:", isLoggedIn, "Session data:", session);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white py-4 flex justify-center shadow">
      <div className="header-container w-full max-w-6xl flex justify-between items-center px-4">
        <div className="header-title-container">
          <h1 className="text-3xl font-bold">
            <span className="text-blue-600">Members</span>
            <span className="text-black">Only</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="relative flex items-center cursor-pointer" onClick={toggleDropdown} ref={dropdownRef}>
          {showDropdown ? <FaChevronUp size={15}/> : <FaChevronDown size={15}/>}
          {status === 'loading'
              ? <UserSkeleton />
              : (
                  <>
                    <span className="user-name mr-2 text-lg ml-1">{session.user.name}</span>
                    {session?.user && <Avatar user={session.user}/>}
                  </>
              )
            }
            <div className={`${showDropdown ? 'block' : 'hidden'} absolute right-20 top-10 bg-gray-50 min-w-max shadow-lg z-10 rounded-md`}>
              <ul>
                <li><Link href="/users/create-post" className="block px-4 py-2 text-black hover:bg-gray-100">Post Message</Link></li>
                <li><a onClick={handleLogout} className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">Log Out</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>


  );
}
