"use client"

import { useState, useEffect } from "react";
import { Header } from "../components/Header.jsx";
import { LoginModal } from "../components/LoginModal.jsx";
import { SignupModal } from "../components/SignupModal.jsx";
import { useSession } from "next-auth/react";
import ClipLoader from "react-spinners/ClipLoader";

export default function Page() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const toggleLoginModal = () => setLoginModalOpen(!isLoginModalOpen);
  const toggleSignupModal = () => setSignupModalOpen(!isSignupModalOpen);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
      setIsLoading(false);
    }

    fetchPosts();
  }, []);

  return (
    <>
      <Header openLoginModal={toggleLoginModal} openSignupModal={toggleSignupModal} />
      {isLoginModalOpen && <LoginModal showModal={isLoginModalOpen} closeModal={toggleLoginModal} />}
      {isSignupModalOpen && <SignupModal showModal={isSignupModalOpen} closeModal={toggleSignupModal} />}
      <div className="content-container">
        <h1 className="messages-header">Messages</h1>
        {isLoading ? (
          <div className="loading-container">
            <ClipLoader loading={isLoading} size={50} />
          </div>
        ) : (
          <>
            {session ? (
              <p>Welcome <strong>{session.user.name}</strong>!</p>
            ) : (
              <p>Welcome to the members only page!</p>
            )}
            {posts.map((post) => (
              <div className="message" key={post._id}>
                <h2>{post.title}</h2>
                <p>{post.message}</p>
                {session && session.user.isMember && (
                  <p>Posted by {post.user.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
