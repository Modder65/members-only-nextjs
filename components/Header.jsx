'use client'

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { UserSkeleton } from "./UserSkeleton";
import { Menu } from "@headlessui/react";
import Avatar from "@/app/users/components/Avatar";
import Link from "next/link";
import HeaderMenu from "./HeaderMenu";
import { logout } from "@/actions/logout";


export function Header() {
  const { data: session, status } = useSession();
  const isLoggedIn = session !== null;
  console.log("Is logged in:", isLoggedIn, "Session data:", session);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    logout();
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

        <div className="flex gap-4 items-center">
          {status === 'loading' ? (
            <UserSkeleton />
          ) : (
            isLoggedIn && (
              <div className="flex flex-row-reverse justify-center items-center">
                {session?.user && <Avatar user={session.user} />}
                <HeaderMenu user={session.user} onLogout={handleLogout} />
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
