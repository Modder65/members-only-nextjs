"use client"

import { useState, useEffect } from "react";
import { Header } from "../components/Header.jsx";
import { LoginModal } from "../components/LoginModal.jsx";
import { SignupModal } from "../components/SignupModal.jsx";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import ClipLoader from "react-spinners/ClipLoader";
import { FiMessageSquare, FiChevronDown, FiChevronUp } from "react-icons/fi";

// -Fix issue with usermodel not being defined at initial post fetch
// (usually have to refresh page multiple times for posts to display on home page)

export default function Page() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const toggleLoginModal = () => setLoginModalOpen(!isLoginModalOpen);
  const toggleSignupModal = () => setSignupModalOpen(!isSignupModalOpen);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleCommentForm = (postId) => {
    setShowCommentForm(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const handleCommentSubmit = async (event, postId) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target;
    const formData = new FormData(form);
    const commentText = formData.get("comment");

    const commentData = {
      message: commentText,
      post: postId,
      user: session.user.id
    };

    try {
      const response = await fetch("/api/submit-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        console.log("Comment submitted successfully");
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCommentsDisplay = (postId) => {
    setShowComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

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
                {post.user && (
                  <p className="post-details">Posted by {post.user.name} on {DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL)}</p>
                )}
                {session && (
                  <>
                    <button onClick={() => toggleCommentForm(post._id)} className="comment-icon-button">
                      <FiMessageSquare />
                    </button>
                    {showCommentForm[post._id] && (
                      <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="comment-form">
                        <div className="form-group">
                          <label htmlFor="comment">Comment</label>
                          <input type="text" placeholder="Write a comment..." name="comment" id="comment" required />
                        </div>
                        <button type="submit" className="comment-form-button">Comment</button>
                      </form>
                    )}
                    <button onClick={() => toggleCommentsDisplay(post._id)} className="show-comments-button">
                      {showComments[post._id] ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {showComments[post._id] && (
                      <div className="comments-section">
                        {post.comments && post.comments.map(comment => (
                          <div key={comment._id} className="comment">
                            <p>{comment.message}</p>
                            <p className="comment-details">By {comment.user.name} on {DateTime.fromISO(comment.createdAt).toLocaleString(DateTime.DATE_FULL)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
