"use client"

import { usePusher } from "@/lib/pusherContext.js";
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
  const { data: session } = useSession(); // Session data for the logged-in user
  const [posts, setPosts] = useState([]); // Stores posts fetched from the API
  const { setUpdatePosts } = usePusher(); // Use the setUpdatePosts function from Pusher Content
  const [showCommentForm, setShowCommentForm] = useState({}); // Tracks which comment forms to show
  const [showReplyForm, setShowReplyForm] = useState({}); // Tracks which reply forms to show
  const [showComments, setShowComments] = useState({}); // Tracks which comments to display
  const [showReplies, setShowReplies] = useState({}); // Tracks which replies to display
  const [isLoading, setIsLoading] = useState(true); // Loading state for API requests
  const [isLoginModalOpen, setLoginModalOpen] = useState(false); // State for login modal visibility
  const [isSignupModalOpen, setSignupModalOpen] = useState(false); // State for signup modal visibility

  // Toggles the visibility of login and signup modals
  const toggleLoginModal = () => setLoginModalOpen(!isLoginModalOpen);
  const toggleSignupModal = () => setSignupModalOpen(!isSignupModalOpen);

  // Toggles the visibility of the comment form for a specific post
  const toggleCommentForm = (postId) => {
    setShowCommentForm(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  // Toggles the visibility of the reply form for a specific comment
  const toggleReplyForm = (commentId) => {
    setShowReplyForm(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  // Toggles the visibility of the comments section for a specific post
  /*
    setShowComments state is an object where each key is a post ID, 
    and the value is a boolean indicating whether the comments for 
    that post should be shown or not. It sets the new state based on
    the previous state using the spread operator (...prevState).
    [postId] is a computed property name in JS. It means the property
    name of the object will be the value of postId. 
  */
  const toggleCommentsDisplay = (postId) => {
    setShowComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  // Toggles the visibility of the replies section for a specific comment
  const toggleRepliesDisplay = (commentId) => {
    setShowReplies(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  // Fetches posts from the API and updates the posts state
  useEffect(() => {
    // Provide the update function to the Pusher context
    setUpdatePosts(() => setPosts);

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
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [setUpdatePosts]);

  // Handles the submission of a new comment
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

  const handleReplySubmit = async (event, commentId) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target;
    const formData = new FormData(form);
    const replyText = formData.get("reply");

    const replyData = {
      message: replyText,
      comment: commentId,
      user: session.user.id
    };

    try {
      const response = await fetch("/api/submit-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(replyData)
      });

      if (response.ok) {
        console.log("Reply submitted successfully");
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsLoading(false);
    }
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
                <p className="post-details">Posted by {post.user.name} on {DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL)}</p>
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
                      {console.log("Rendering comments for post:", post._id, post.comments)}
                        {post.comments.map(comment => (
                          <div key={comment._id} className="comment">
                            <p>{comment.message}</p>
                            <p className="comment-details">By {comment.user.name} on {DateTime.fromISO(comment.createdAt).toLocaleString(DateTime.DATE_FULL)}</p>
                            <button onClick={() => toggleReplyForm(comment._id)} className="reply-button">Reply</button>
                            {showReplyForm[comment._id] && (
                              <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="reply-form">
                                <div className="form-group">
                                  <label htmlFor="reply">Reply</label>
                                  <input type="text" placeholder="Write a reply..." name="reply" id="reply" required />
                                </div>
                                <button type="submit" className="reply-form-button">Submit Reply</button>
                              </form>
                            )}
                            <button onClick={() => toggleRepliesDisplay(comment._id)} className="show-replies-button">
                              {showReplies[comment._id] ? 'Hide Replies' : 'Show Replies'}
                            </button>
                            {showReplies[comment._id] && (
                              <div className="replies-section">
                                {comment.replies && comment.replies.map(reply => (
                                  <div key={reply._id} className="reply">
                                    <p>{reply.message}</p>
                                    <p className="reply-details">By {reply.user.name} on {DateTime.fromISO(reply.createdAt).toLocaleString(DateTime.DATE_FULL)}</p>
                                  </div>
                                ))}
                              </div>
                            )}
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
