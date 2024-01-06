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
      // Use the friendshipId to identify the request to be removed
      dispatch(removePendingRequest(data.friendshipId)); 

      // Add the new friend to the friends state
      // Use the newFriend data received from the Pusher event
      dispatch(addFriend(data.newFriend)); 
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