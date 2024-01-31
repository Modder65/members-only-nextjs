"use client"

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from 'react-redux';
import { setUserPosts, setFriends, setPendingRequests, setUserPostsLoaded, setFriendshipStatus } from "@/redux/features/accountSlice";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardContent,
  CardListItem,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { toast } from "sonner";
import { BeatLoader } from "react-spinners";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DateTime } from "luxon";
import axios from "axios";
import Link from "next/link";

const Account = () => {
  // ... existing state and useEffect hooks
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const user = useCurrentUser();

  const dispatch = useDispatch();
  const { friends, pendingRequests, friendshipStatus } = useSelector((state) => state.account);

  const [ref, inView] = useInView({ threshold: 0 });

  const handleTabChange = (tabValue) => {
    // Map the tab value to its corresponding index
    const tabIndexMap = {
      "about": 0,
      "friends": 1,
      "posts": 2
    };
    setSelectedTabIndex(tabIndexMap[tabValue]);
  };

  useEffect(() => {
    if (selectedTabIndex === 1 && (friends.length === 0 || pendingRequests.length === 0)) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const friendsResponse = await axios.get('/api/friends');
          dispatch(setFriends(friendsResponse.data));

          const pendingRequestsResponse = await axios.get('/api/pending-requests', { params: { userId: user.id } });
          dispatch(setPendingRequests(pendingRequestsResponse.data.requests));
        } catch (error) {
          toast.error("Failed to fetch data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedTabIndex, friends.length, pendingRequests.length, user?.id, dispatch]);
  
  useEffect(() => {
    if (inView && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasMore]);
  
  const handleAcceptRequest = async (friendRequestId) => {
    try {
      const response = await axios.post('/api/accept-friend-request', { friendRequestId });
      const newFriend = response.data.newFriend;
  
      // Update the Redux state
      dispatch(setFriendshipStatus('ACCEPTED'));
  
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error("Failed to accept friend request!");
    }
  };
  

  const handleDeclineRequest = async (friendRequestId) => {
    try {
      await axios.post('/api/decline-friend-request', { friendRequestId });
      toast.success("Friend request declined!");
    } catch (error) {
      toast.error("Failed to decline friend request!");
    }
  };

  const handleRemoveFriend = async (friendRequestId) => {
    try {
      await axios.post('/api/remove-friend', { friendRequestId });
      toast.success("Unfriended!");
    } catch (error) {
      toast.error("Failed to unfriend!");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-5">
      <Tabs defaultValue="about" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 w-full bg-white shadow-md mb-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold mb-4">About</h2>
            </CardHeader>
            <CardContent>
              <p>Member Since: {
                  DateTime.fromISO(user?.createdAt).toLocaleString({
                    month: 'numeric',
                    day: 'numeric',
                    year: '2-digit',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="friends">
          {loading ? (
            <div className="flex justify-center">
              <BeatLoader />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
              </CardHeader>
              <CardContent>
                {pendingRequests.length > 0 ? (
                  <div className="space-y-2">
                    {pendingRequests.map(request => (
                      // ... Render each pending request
                      <div key={request.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={request?.user?.image || ""}/>
                            <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                              from-green-400 to-green-800">
                              <FaUser className="text-white"/>
                            </AvatarFallback>
                          </Avatar>
                          <p>{request?.user?.name}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button type="button"
                            className="bg-green-600 rounded-md px-2 py-1 text-white hover:opacity-80"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Accept
                          </button>
                          <button type="button"
                            className="bg-rose-600 rounded-md px-2 py-1 text-white hover:opacity-80"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p>No incoming friend requests.</p>}
                <CardHeader className="pl-0 pr-0">
                  <h2 className="text-xl font-bold mt-6 mb-4">Friends</h2>
                </CardHeader>
                
                {friends.length > 0 ? (
                  <div className="space-y-2">
                    {friends.map(friendship => (
                      // ... Render each friend
                      <div key={friendship.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={user.id === friendship.senderId ? friendship.friend.image : friendship.user.image || ""}/>
                              <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                                from-green-400 to-green-800">
                                <FaUser className="text-white"/>
                              </AvatarFallback>
                            </Avatar>
                            <Link href={`/users/${user.id === friendship.senderId ? friendship.friend.id : friendship.user.id}`} className="text-blue-600 hover:underline">
                              <span className="text-blue-600 hover:underline cursor-pointer">{user.id === friendship.senderId ? friendship.friend.name : friendship.user.name}</span>
                            </Link>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <button type="button"
                                  className="bg-rose-600 rounded-md px-2 py-1 text-white hover:opacity-80"
                                >
                                Unfriend
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to unfriend?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This user will be removed from your friends list.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveFriend(friendship.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
                          </div>
                      </div>
                    ))}
                  </div>
                ) : <p>{`You have no friends :(`}</p>}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
