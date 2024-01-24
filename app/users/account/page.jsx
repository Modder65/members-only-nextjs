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
import { toast } from "sonner";
import { BeatLoader } from "react-spinners";
import Avatar from '../components/Avatar';
import PostList from "../components/PostList";
import axios from "axios";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

const Account = () => {
  // ... existing state and useEffect hooks
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const user = useCurrentUser();

  const dispatch = useDispatch();
  const { userPosts, friends, pendingRequests, userPostsLoaded, friendshipStatus } = useSelector((state) => state.account);

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
    const fetchPosts = async () => {
      if (selectedTabIndex === 2) {
        setIsLoading(true);
        try {
          const limit = 10;
          const response = await axios.get(`/api/user-posts?page=${page}&limit=${limit}`);
          dispatch(setUserPosts(response.data));
          setHasMore(response.data.length === limit);
        } catch (error) {
          toast.error("Failed to fetch posts");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchPosts();
  }, [page, selectedTabIndex, dispatch]);
  
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
      <Tabs defaultValue="account" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 w-full bg-white shadow-md mb-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="posts">Your Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="about">Content 0</TabsContent>
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
                          <Avatar user={request?.user}/>
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

                <h2 className="text-xl font-bold mt-6 mb-4">Friends</h2>
                {friends.length > 0 ? (
                  <div className="space-y-2">
                    {friends.map(friendship => (
                      // ... Render each friend
                      <div key={friendship.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                          <div className="flex items-center gap-2">
                            <Avatar user={user.id === friendship.senderId ? friendship.friend : friendship.user}/>
                            <Link href={`/users/${user.id === friendship.senderId ? friendship.friend.id : friendship.user.id}`} className="text-blue-600 hover:underline">
                              <span className="text-blue-600 hover:underline cursor-pointer">{user.id === friendship.senderId ? friendship.friend.name : friendship.user.name}</span>
                            </Link>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button type="button"
                              className="bg-rose-600 rounded-md px-2 py-1 text-white hover:opacity-80"
                              onClick={() => handleRemoveFriend(friendship.id)}
                            >
                              Unfriend
                            </button>
                          </div>
                      </div>
                    ))}
                  </div>
                ) : <p>{`You have no friends :(`}</p>}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="posts">
          <PostList posts={userPosts}/>
          {hasMore ? (
            <div ref={ref} className="flex justify-center">
              <BeatLoader />
            </div>
          ) : (
            <p className="text-center font-semibold text-xl mt-5">There are no more posts.</p>
          )} 
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
