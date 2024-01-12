import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useDispatch } from "react-redux";
import { toggleLike } from "@/redux/features/likesSlice";


export const PusherLikesProvider = ({ children }) => {
  const dispatch = useDispatch();
  

  useEffect(() => {
    const handleLikeUpdate = (data) => {
      if (data.postId) {
        dispatch(toggleLike({ postId: data.postId, likeCount: data.likeCount }));
      } else if (data.commentId) {
        dispatch(toggleLike({ commentId: data.commentId, likeCount: data.likeCount }));
      } else if (data.replyId) {
        dispatch(toggleLike({ replyId: data.replyId, likeCount: data.likeCount }));
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
  }, [dispatch]);

  return <>{children}</>;
};