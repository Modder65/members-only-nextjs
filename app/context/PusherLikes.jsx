import { useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { useDispatch } from "react-redux";
import { toggleLike } from "@/redux/features/likesSlice";


export const PusherLikesProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLikeUpdate = (data) => {
      dispatch(toggleLike({
        itemId: data.itemId, 
        currentUserLiked: data.currentUserLiked, 
        likeCount: data.likeCount,
      }));
    }
    

    pusherClient.subscribe("likes-channel");
    pusherClient.bind("like:update", handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("like:update", handleLikeUpdate);
    };
  }, [dispatch]);

  return <>{children}</>;
};