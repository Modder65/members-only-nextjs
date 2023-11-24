"use client"

import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export function SignupModal({ closeModal, showModal }) {
  const [isLoading, setIsLoading] = useState(false);
  // Closes the modal when you click on the modal div outside the modal content div
  const modalRef = useRef(null);

  const handleClick = (event) => {
    if (modalRef.current === event.target) {
      closeModal();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("Signup response", response);

      if (response.ok) {
        // Call signIn with credentials after successful signup
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (signInResult.error) {
          console.error("Sign-in error after signup:", signInResult.error);
        } else {
          closeModal();
        }
      } else {
        // Handle sign-up errors 
        console.error("Signup failed:", error);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle network errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={modalRef} onClick={handleClick} className={`modal ${showModal ? 'show' : ''}`} id="signupModal">
      {isLoading && (
        <div className="loading-container">
          <ClipLoader loading={isLoading} size={50} />
        </div>
      )}
      <div className="modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" placeholder="Name Here" required/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" required/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required/>
          </div>
          <button className="modal-button" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}