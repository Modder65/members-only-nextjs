import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { Post } from "@prisma/client";
import usePostsStore from "@/zustand/postStore";


export const PusherPostDeleteProvider = ({ children }) => {

  const { removePost } = usePostsStore(state => ({
    removePost: state.removePost,
  }));
  
  useEffect(() => {
    const handlePostDelete = (data: Post) => {
      removePost(data.id);
    }
    
    pusherClient.subscribe("posts-channel");
    pusherClient.bind("post:deleted", handlePostDelete);

    return () => {
      pusherClient.unsubscribe("posts-channel");
      pusherClient.unbind("post:deleted", handlePostDelete);
    };
  }, [removePost]);

  return <>{children}</>;
};