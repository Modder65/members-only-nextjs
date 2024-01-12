import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useDispatch } from "react-redux";
import { toggleLike } from "@/redux/features/likesSlice";


export const PusherLikesProvider = ({ children }) => {
  const dispatch = useDispatch();
  

  useEffect(() => {
    const handleLikeUpdate = (data) => {
      try {
        dispatch(toggleLike({
          itemId: data.itemId, 
          likeCount: data.likeCount,
          currentUserLiked: data.currentUserLiked, 
        }));
      } catch (error) {
        console.error(error);
      }
    }
    
    pusherClient.subscribe("likes-channel");
    pusherClient.bind("like:post", handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("like:post", handleLikeUpdate);
    };
  }, [dispatch]);

  return <>{children}</>;
};