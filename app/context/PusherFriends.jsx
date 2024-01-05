import { useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { useDispatch } from "react-redux";
import { setPendingRequests } from "@/redux/features/accountSlice";


export const PusherFriendsProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Handler for sending friend requests
    const handleSendFriendRequest = (data) => {
      dispatch(setPendingRequests({
        pendingRequests: data.pendingRequests,
      }));
    }

    pusherClient.subscribe("friends-channel");
    pusherClient.bind("friend:created", handleSendFriendRequest);

    return () => {
      pusherClient.unsubscribe("friends-channel");
      pusherClient.unbind("friend:created", handleSendFriendRequest);
    };
  }, [dispatch]);

  return <>{children}</>;
};