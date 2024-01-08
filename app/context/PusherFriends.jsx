import { useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { useDispatch } from "react-redux";
import { addPendingRequest, removePendingRequest, addFriend } from "@/redux/features/accountSlice";


export const PusherFriendsProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewFriendRequest = (data) => {
      dispatch(addPendingRequest(data));
    };

    const handleAcceptFriendRequest = (data) => {
      dispatch(removePendingRequest(data.id));
    
      dispatch(addFriend(data));
    };

    const handleDeclineFriendRequest = (data) => {
      dispatch(removePendingRequest(data.friendRequestId));
    };

    const handleUnfriend = (data) => {
      dispatch(removeFriend(data.id));
    }

    pusherClient.subscribe("friends-channel");
    pusherClient.bind("friend-request:created", handleNewFriendRequest);
    pusherClient.bind("friend-request:accepted", handleAcceptFriendRequest);
    pusherClient.bind("friend-request:declined", handleDeclineFriendRequest);
    pusherClient.bind("friend:remove", handleUnfriend);

    return () => {
      pusherClient.unsubscribe("friends-channel");
      pusherClient.unbind("friend-request:created", handleNewFriendRequest);
      pusherClient.unbind("friend-request:accepted", handleAcceptFriendRequest);
      pusherClient.unbind("friend-request:declined", handleDeclineFriendRequest);
      pusherClient.unbind("friend:remove", handleUnfriend);
    };
  }, [dispatch]);

  return <>{children}</>;
};