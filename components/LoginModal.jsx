"use client"

import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export function LoginModal({ closeModal, showModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);
    console.log("Sign-in result:", result);

    if (result.error) {
      setErrorMessage("Incorrect username or password. Please try again.");
    } else {
      closeModal();
    }
  };

  return (
    <div ref={modalRef} onClick={handleClick} className={`modal ${showModal ? 'show' : ''}`} id="loginModal">
      {isLoading && (
        <div className="loading-container">
          <ClipLoader loading={isLoading} size={50} />
        </div>
      )}
      <div className="modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input type="email" name="email" id="login-email" required />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input type="password" name="password" id="login-password" required />
          </div>
          <button className="modal-button" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}


