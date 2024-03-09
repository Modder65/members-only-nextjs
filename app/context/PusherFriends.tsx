import { useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { Friendship } from "@prisma/client";
import useAccountStore from "@/zustand/accountStore";


export const PusherFriendsProvider = ({ children }) => {
  const { addPendingRequest, removePendingRequest, addFriend, removeFriend } = useAccountStore(state => ({
    addPendingRequest: state.addPendingRequest,
    removePendingRequest: state.removePendingRequest,
    addFriend: state.addFriend,
    removeFriend: state.removeFriend
  }));

  useEffect(() => {
    const handleNewFriendRequest = (data: Friendship) => {
      addPendingRequest(data);
    };

    const handleAcceptFriendRequest = (data: Friendship) => {
      removePendingRequest(data.id);
    
      addFriend(data);
    };

    const handleDeclineFriendRequest = (data: Friendship) => {
      removePendingRequest(data.id);
    };

    const handleUnfriend = (data: Friendship) => {
      removeFriend(data.id);
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
  }, [addFriend, addPendingRequest, removeFriend, removePendingRequest]);

  return <>{children}</>;
};