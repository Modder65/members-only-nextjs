"use client"

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from 'react-redux';
import { setUserPosts, setFriends, setPendingRequests, setUserPostsLoaded, setFriendshipStatus } from "@/redux/features/accountSlice";
import { Tab } from '@headlessui/react';
import { Fragment } from "react";
import { toast } from "sonner";
import { CustomLoader } from "@/components/CustomLoader";
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

  useEffect(() => {
    if (selectedTabIndex === 1) { // Fetch friends and pending requests
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
  }, [selectedTabIndex, user?.id, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userPostsLoaded) {
        setIsLoading(true);
        try {
          const limit = 10;
          const response = await axios.get(`/api/user-posts?page=${page}&limit=${limit}`);
          
          dispatch(setUserPosts(response.data)); // Dispatch to Redux store
          dispatch(setUserPostsLoaded(true)); // Set to true to avoid refetching
          setHasMore(response.data.length === limit);
        } catch (error) {
          toast.error("Failed to fetch posts");
        } finally {
          setIsLoading(false);
        }
      }
    };

     // Fetch posts only when the "Your Posts" tab is selected
     if (selectedTabIndex === 2 && !userPostsLoaded) {
      fetchPosts();
    }
  }, [page, selectedTabIndex, userPostsLoaded, dispatch]);


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
    <div className="mx-auto max-w-6xl px-5 py-5">
      {/* ... Avatar and user name section */}

      <div>
        <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
          <Tab.List className="flex gap-5 mb-5 border-b-2">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`py-2 px-4 text-sm font-medium leading-5 text-gray-700 rounded-t-lg focus:outline-none focus:ring-2 ring-white ring-opacity-60 ${
                    selected ? 'border-b-2 border-blue-600 bg-white' : 'hover:bg-gray-100'
                  }`}
                >
                  About
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`py-2 px-4 text-sm font-medium leading-5 text-gray-700 rounded-t-lg focus:outline-none focus:ring-2 ring-white ring-opacity-60 ${
                    selected ? 'border-b-2 border-blue-600 bg-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Friends
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`py-2 px-4 text-sm font-medium leading-5 text-gray-700 rounded-t-lg focus:outline-none focus:ring-2 ring-white ring-opacity-60 ${
                    selected ? 'border-b-2 border-blue-600 bg-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Your Posts
                </button>
              )}
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            {/* ... Other panels (About, Your Posts, etc.) */}
            <Tab.Panel>Content 0</Tab.Panel>
            <Tab.Panel>
              {loading ? (
                <div className="flex justify-center">
                  <CustomLoader />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
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
                  ) : <p>No pending friend requests.</p>}

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
                </>
              )}
            </Tab.Panel>
            <Tab.Panel>
              <PostList posts={userPosts}/>
                {hasMore ? (
                  <div ref={ref} className="flex justify-center">
                    <CustomLoader />
                  </div>
                ) : (
                  <p className="text-center font-semibold text-xl mt-5">There are no more posts.</p>
                )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Account;
