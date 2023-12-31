/*
import { createContext, useContext, useEffect, useState } from "react";
import { pusherClient } from "./pusher";

const PusherContext = createContext();

export const usePusher = () => useContext(PusherContext);

export const PusherProvider = ({ children }) => {
  // Stat to store the update function provided by the page component
  const [updatePosts, setUpdatePosts] = useState(null);

  useEffect(() => {
    //Subscribbe to Pusher channels and bind events here
    const channel = pusherClient.subscribe("posts-channel");

    channel.bind("new-post", (newPost) => {
      console.log("New post received:", newPost);
      if (updatePosts) {
        updatePosts(prevPosts => [newPost, ...prevPosts]);
      }
    });

    channel.bind("new-comment", (newComment) => {
      if (updatePosts) {
        updatePosts(prevPosts => {
          return prevPosts.map(post => {
            if (post._id === newComment.post) {
              // Ensure newComment has an empty replies array
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
      // Clean up process
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [updatePosts]);

  return (
    <PusherContext.Provider value={{ setUpdatePosts }}>
      {children}
    </PusherContext.Provider>
  );
};
*/