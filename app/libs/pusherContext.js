import { createContext, useContext, useEffect, useState } from "react";
import { pusherClient } from "./pusher";

// Create a new React context for Pusher
const PusherContext = createContext();

// Custom hook to access the context value
export const usePusher = () => useContext(PusherContext);

export const PusherProvider = ({ children }) => {
  // State to store a function that updates posts. This function will be provided by the component that uses this context.
  const [updatePosts, setUpdatePosts] = useState(null);

  useEffect(() => {
    // Subscribe to the 'posts-channel' channel in Pusher
    const channel = pusherClient.subscribe("posts-channel");

    // Bind an event listener for 'new-post' events. When a new post is received, the updatePosts function is called to update the state.
    channel.bind("new-post", (newPost) => {
      console.log("New post received:", newPost);
      if (updatePosts) {
        updatePosts(prevPosts => [newPost, ...prevPosts]);
      }
    });

    // Bind an event listener for 'new-comment' events. When a new comment is received, it's added to the respective post.
    channel.bind("new-comment", (newComment) => {
      if (updatePosts) {
        updatePosts(prevPosts => {
          return prevPosts.map(post => {
            if (post._id === newComment.post) {
              // Ensure newComment has an empty replies array if not already present
              newComment.replies = newComment.replies || [];
              return {
                ...post,
                comments: [...post.comments, newComment]
              };
            }
            return post;
          });
        });
      }
    });

    // Bind an event listener for 'new-reply' events. When a new reply is received, it's added to the respective comment.
    channel.bind("new-reply", (newReply) => {
      if (updatePosts) {
        updatePosts(prevPosts => {
          return prevPosts.map(post => {
            const updatedComments = post.comments.map(comment => {
              if (comment._id === newReply.comment) {
                return {
                  ...comment,
                  replies: [...comment.replies, newReply]
                };
              }
              return comment;
            });
            return { ...post, comments: updatedComments };
          });
        });
      }
    });

    return () => {
      // Unbind all event bindings and unsubscribe from the channel when the component unmounts.
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [updatePosts]); // Re-run this effect if updatePosts function changes

  // Provide the context value
  return (
    <PusherContext.Provider value={{ setUpdatePosts }}>
      {children}
    </PusherContext.Provider>
  );
};