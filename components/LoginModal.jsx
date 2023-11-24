"use client"

import { signIn } from "next-auth/react";
import { useRef } from "react";

export function LoginModal({ closeModal, showModal }) {
  // Closes the modal when you click on the modal div outside the modal content div
  const modalRef = useRef(null);

  const handleClick = (event) => {
    if (modalRef.current === event.target) {
      closeModal();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log("Sign-in result:", result);

    if (result.error) {
      // handle error
    } else {
      closeModal();
    }
  };

  return (
    <div ref={modalRef} onClick={handleClick} className={`modal ${showModal ? 'show' : ''}`} id="loginModal">
      <div className="modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input type="email" name="email" id="login-email" required/>
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input type="password" name="password" id="login-password" required/>
          </div>
          <button className="modal-button" type="submit">Log In</button>
        </form>
      </div>
    </div>
  )
}