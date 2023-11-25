"use client"

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

export default function CreatePostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const userId = session.user.id;
    const data = { title, message, userId };

    try {
      const response = await fetch("/api/submit-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle success redirect to home page
        console.log("Post created successfully");
        router.push("/");
      } else {
        // Handle errors
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      // Handle network errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-container">
      <h1>Post a Message</h1>
      {isLoading && (
        <div className="loading-container">
          <ClipLoader loading={isLoading} size={50} />
        </div>
      )}
      <form className="message-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button className="message-form-button" type="submit">Post</button>
      </form>
    </div>
  );
}