import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useDispatch } from "react-redux";
import { editPost } from "@/redux/features/postsSlice";


export const PusherPostEditProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handlePostEdit = (data) => {
      dispatch(editPost(data));
    }
    
    pusherClient.subscribe("posts-channel");
    pusherClient.bind("post:edited", handlePostEdit);

    return () => {
      pusherClient.unsubscribe("posts-channel");
      pusherClient.unbind("post:edited", handlePostEdit);
    };
  }, [dispatch]);

  return <>{children}</>;
};