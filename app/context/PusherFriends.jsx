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

    const handleAcceptFriendRequest = (data) => {
      // Remove the accepted request from pendingRequests
      dispatch(removePendingRequest(data.friendship.id)); // Assuming 'data.friendship' contains the friendship ID to be removed from pendingRequests

      // Add the new friend to the friends state
      dispatch(addFriend(data.receiver)); // Assuming 'receiver' is the new friend
    };

    pusherClient.subscribe("friends-channel");
    pusherClient.bind("friend-request:created", handleNewFriendRequest);
    pusherClient.bind("friend-request:accepted", handleAcceptFriendRequest);

    return () => {
      pusherClient.unsubscribe("friends-channel");
      pusherClient.unbind("friend-request:created", handleNewFriendRequest);
      pusherClient.unbind("friend-request:accepted", handleAcceptFriendRequest);
    };
  }, [dispatch]);

  return <>{children}</>;
};