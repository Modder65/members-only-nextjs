"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from 'react-redux';
import { setUserPosts, setFriends, setPendingRequests } from "@/redux/features/accountSlice";
import { Tab } from '@headlessui/react'
import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { CustomLoader } from "@/components/CustomLoader";
import Avatar from '../components/Avatar';
import PostList from "../components/PostList";
import axios from "axios";


const Account = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userPostsLoaded, setUserPostsLoaded] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const dispatch = useDispatch();
  const { userPosts, friends, pendingRequests } = useSelector((state) => state.account);

  const [ref, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userPostsLoaded) {
        setIsLoading(true);
        try {
          const limit = 10;
          const response = await axios.get(`/api/user-posts?page=${page}&limit=${limit}`);
          
          dispatch(setUserPosts(response.data)); // Dispatch to Redux store
          setUserPostsLoaded(true); // Set to true to avoid refetching
          setHasMore(response.data.length === limit);
        } catch (error) {
          toast.error("Failed to fetch posts");
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Fetch posts only when the "Your Posts" tab is selected
    if (selectedTabIndex === 3 && !userPostsLoaded) {
      fetchPosts();
    }
  }, [page, selectedTabIndex, userPostsLoaded, dispatch]);

  
  useEffect(() => {
    if (selectedTabIndex === 2) { // Fetch pending requests
      const fetchPendingRequests = async () => {
        try {
          const response = await axios.get('/api/pending-requests', { params: { userId: session.user.id } });
          dispatch(setPendingRequests(response.data.requests));  // Dispatching to Redux store
        } catch (error) {
          toast.error("Failed to fetch pending requests");
        }
      };
      fetchPendingRequests();
    }
  }, [selectedTabIndex, session?.user?.id, dispatch]);

  useEffect(() => {
    if (selectedTabIndex === 1) { // Fetch friends
      const fetchFriends = async () => {
        try {
          const response = await axios.get('/api/friends');
          dispatch(setFriends(response.data));  // Dispatching to Redux store
        } catch (error) {
          toast.error("Failed to fetch friends");
        }
      };
      fetchFriends();
    }
  }, [selectedTabIndex, dispatch]);

  const handleAcceptRequest = async (friendRequsetId) => {
    try {
      await axios.post('/api/accept-friend-request', { friendRequsetId });
      toast.success("Friend request accepted");
    } catch (error) {
      toast.error("Failed to accept friend request");
    }
  };

  const handleDeclineRequest = async (friendRequsetId) => {
    try {
      await axios.post('/api/decline-friend-request', { friendRequsetId });
      toast.success("Friend request declined");
    } catch (error) {
      toast.error("Failed to decline friend request");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-5">
      <div className='flex gap-2 items-center mb-5'>
        <Avatar user={session?.user}/>
        <p className="text-lg font-semibold">{session?.user?.name}</p>
      </div>
      <div>
        <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
          <Tab.List className="flex gap-5 mb-5 border-b-2">
            {/* Use the `tab` function to apply styles dynamically */}
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
                  Pending Requests
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
            {/* Repeat for other tabs */}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>Content 1</Tab.Panel>
            <Tab.Panel>
              {friends.length > 0 ? (
                  <div className="space-y-2">
                    {friends.map(friend => (
                      <div key={friend.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                        <div className="flex items-center gap-2">
                          <Avatar user={friend?.user}/>
                          <p>{friend?.user?.name}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button type="button"
                            className="
                            bg-rose-600
                              rounded-md
                              px-2
                              py-1
                              text-white
                              hover:opacity-80
                            "
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            Unfriend
                          </button>
                        </div>
                      </div>
                      ))}
                  </div>
                ) : (
                  <p>{`You have no friends :(`}</p>
                )}
            </Tab.Panel>
            <Tab.Panel>
              {pendingRequests.length > 0 ? (
                <div className="space-y-2">
                  {pendingRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                      <div className="flex items-center gap-2">
                        <Avatar user={request?.user}/>
                        <p>{request?.user?.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button type="button"
                          className="
                          bg-green-600
                            rounded-md
                            px-2
                            py-1
                            text-white
                            hover:opacity-80
                          "
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </button>
                        <button type="button"
                          className="
                          bg-rose-600
                            rounded-md
                            px-2
                            py-1
                            text-white
                            hover:opacity-80
                          "
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                    ))}
                </div>
              ) : (
                <p>No pending friend requests.</p>
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
}
 
export default Account;