import { useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { useDispatch } from "react-redux";
import { addPendingRequest } from "@/redux/features/accountSlice";


export const PusherFriendsProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewFriendRequest = (data) => {
      dispatch(addPendingRequest(data));
    };

    pusherClient.subscribe("friend-requests-channel");
    pusherClient.bind("friend-request:created", handleNewFriendRequest);

    return () => {
      pusherClient.unsubscribe("friend-requests-channel");
      pusherClient.unbind("friend-request:created", handleNewFriendRequest);
    };
  }, [dispatch]);

  return <>{children}</>;
};