import { useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { useDispatch } from "react-redux";
import { toggleLike } from "@/redux/features/likesSlice";


export const PusherLikesProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLikePost = (data) => {
      dispatch(toggleLike({
        postId: data.itemId, 
        currentUserLiked: data.currentUserLiked, 
        likeCount: data.likeCount,
      }));
    }
    

    pusherClient.subscribe("likes-channel");
    pusherClient.bind("like:post", handleLikePost);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("like:post", handleLikePost);
    };
  }, [dispatch]);

  return <>{children}</>;
};