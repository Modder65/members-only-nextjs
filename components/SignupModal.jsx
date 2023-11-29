"use client"

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

export function SignupModal({ closeModal, showModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const modalRef = useRef(null);
  const router = useRouter();

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // Password validation regex
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleClick = (event) => {
    if (modalRef.current === event.target) {
      closeModal();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setEmailError(""); // Reset email error
    setPasswordError(""); // Reset password error

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    // Check if email matches the regex
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      setIsLoading(false);
      return; // Stop form submission
    }

    // Check if password matches the regex
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.");
      setIsLoading(false);
      return; // Stop form submission
    }

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
        router.push("/verify-account");
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
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required/>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <button className="modal-button" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
