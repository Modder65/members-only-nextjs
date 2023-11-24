"use client"

import { useState } from "react";
import { Header } from "../components/Header.jsx";
import { LoginModal } from "../components/LoginModal.jsx";
import { SignupModal } from "../components/SignupModal.jsx";

export default function Page() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const toggleLoginModal = () => setLoginModalOpen(!isLoginModalOpen);

  const toggleSignupModal = () => setSignupModalOpen(!isSignupModalOpen);

  return (
    <>
      <Header openLoginModal={toggleLoginModal} openSignupModal={toggleSignupModal} />
      {isLoginModalOpen && <LoginModal showModal={isLoginModalOpen} closeModal={toggleLoginModal} />}
      {isSignupModalOpen && <SignupModal showModal={isSignupModalOpen} closeModal={toggleSignupModal} />}
      <div className="content-container">
        <h1 className="messages-header">Messages</h1>
      </div>
    </>
  )
}