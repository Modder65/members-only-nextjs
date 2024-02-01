import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useDispatch } from "react-redux";
import { removePost } from "@/redux/features/postsSlice";


export const PusherPostDeleteProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handlePostDelete = (data) => {
      dispatch(removePost(data.id));
    }
    
    pusherClient.subscribe("posts-channel");
    pusherClient.bind("post:deleted", handlePostDelete);

    return () => {
      pusherClient.unsubscribe("posts-channel");
      pusherClient.unbind("post:deleted", handlePostDelete);
    };
  }, [dispatch]);

  return <>{children}</>;
};