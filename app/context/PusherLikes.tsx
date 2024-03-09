import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { LikeWithCount } from "@/types/types";
import useLikesStore from "@/zustand/likesStore";


export const PusherLikesProvider = ({ children }) => {
  const { toggleLike } = useLikesStore(state => ({
    toggleLike: state.toggleLike
  }));
  

  useEffect(() => {
    const handleLikeUpdate = (data: LikeWithCount) => {
      if (data.postId) {
        toggleLike({ postId: data.postId, likeCount: data.likeCount });
      } else if (data.commentId) {
        toggleLike({ commentId: data.commentId, likeCount: data.likeCount });
      } else if (data.replyId) {
        toggleLike({ replyId: data.replyId, likeCount: data.likeCount });
      }
    }
    
    pusherClient.subscribe("likes-channel");
    pusherClient.bind("like:post", handleLikeUpdate);
    pusherClient.bind("like:comment", handleLikeUpdate);
    pusherClient.bind("like:reply", handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("like:post", handleLikeUpdate);
      pusherClient.unbind("like:comment", handleLikeUpdate);
      pusherClient.unbind("like:reply", handleLikeUpdate);
    };
  }, [toggleLike]);

  return <>{children}</>;
};