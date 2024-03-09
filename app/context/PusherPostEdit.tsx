import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { Post } from "@prisma/client";
import usePostsStore from "@/zustand/postStore";




export const PusherPostEditProvider = ({ children }) => {
  const { editPost } = usePostsStore(state => ({
    editPost: state.editPost,
  }));
  
  useEffect(() => {
    const handlePostEdit = (data: Post) => {
      editPost(data);
    }
    
    pusherClient.subscribe("posts-channel");
    pusherClient.bind("post:edited", handlePostEdit);

    return () => {
      pusherClient.unsubscribe("posts-channel");
      pusherClient.unbind("post:edited", handlePostEdit);
    };
  }, [editPost]);

  return <>{children}</>;
};