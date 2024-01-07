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
      dispatch(removePendingRequest(data.friendshipId));
    
      dispatch(addFriend({
        id: data.friendshipId,
        user: data.user,
        friend: data.friend,
      }));
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