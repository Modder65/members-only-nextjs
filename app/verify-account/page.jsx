"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

export default function Verification() {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      
      console.log("Client side", code);

      if (response.ok) {
        setIsVerified(true);
        setTimeout(() => {
          router.push("/");
        }, 2000); // Redirect after 2 seconds
      } else {
        // display error message
        setErrorMessage("Incorrect verification code");
      }
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="content-container">
      <h1>Verify Your Account</h1>
      {isLoading && !isVerified && (
        <div className="loading-container">
          <ClipLoader loading={isLoading} size={50} />
        </div>
      )}
      {isVerified && <p>Verification successful. Redirecting to home page...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!isVerified && (
        <form onSubmit={handleSubmit} className="verification-form">
          <div className="form-group">
            <label htmlFor="code">Verification Code</label>
            <input
              type="text"
              name="code"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              required
            />
          </div>
          <button type="submit" className="verification-form-button">Verify</button>
        </form>
      )}
    </div>
  );
}