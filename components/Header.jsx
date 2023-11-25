/*
export function Header({ openLoginModal, openSignupModal }) {
  return (
    <header>
      <div className="header-container">
        <div className="header-title-container">
          <h1>
            <span className="members">Members</span>
            <span className="only">Only</span>
          </h1>
        </div>
        <div className="header-button-container">
          <button className="header-button login-button" onClick={openLoginModal}>Log In</button>
          <button className="header-button signup-button" onClick={openSignupModal}>Sign Up</button>
        </div>
      </div>
    </header>
  )
}
*/


import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export function Header({ openLoginModal, openSignupModal }) {
  const { data: session } = useSession();
  const isLoggedIn = session !== null;
  console.log("Is logged in:", isLoggedIn, "Session data:", session);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    signOut();
    console.log("Is logged in:", isLoggedIn, "Session data:", session);
  };


  return (
    <header>
      <div className="header-container">
        <div className="header-title-container">
          <h1>
            <span className="members">Members</span>
            <span className="only">Only</span>
          </h1>
        </div>
        <div className="header-button-container">
          {!session ? (
            <>
              <button className="header-button login-button" onClick={openLoginModal}>Log In</button>
              <button className="header-button signup-button" onClick={openSignupModal}>Sign Up</button>
            </>
          ) : (
            <div className="user-menu" onClick={toggleDropdown}>
              <span className="user-name">{session.user.name}</span>
              <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                <ul>
                  <li><Link href="/create-post">Post Message</Link></li>
                  <li><a onClick={handleLogout}>Log Out</a></li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
