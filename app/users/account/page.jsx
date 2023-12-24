"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
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
  const [userPosts, setUserPosts] = useState([]);
  const [userPostsLoaded, setUserPostsLoaded] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (selectedTabIndex !== 2) {
      return;
    }

    const fetchPosts = async () => {
      if (!userPostsLoaded) {
        setIsLoading(true);
        try {
          const limit = 10;
          const response = await axios.get(`/api/user-posts?page=${page}&limit=${limit}`);
          
          // If page is 0, replace the posts; otherwise, append them
          if (page === 0) {
            setUserPosts(response.data);
            setUserPostsLoaded(true);
          } else {
            setUserPosts(prevPosts => [...prevPosts, ...response.data]);
            setUserPostsLoaded(true);
          }
    
          setHasMore(response.data.length === limit);
        } catch (error) {
          toast.error("Failed to fetch posts");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();
  }, [page, selectedTabIndex, userPostsLoaded]);

  useEffect(() => {
    if (selectedTabIndex !== 2 || !inView || !hasMore) {
      return;
    }

    setPage(prevPage => prevPage + 1);
  }, [inView, hasMore, selectedTabIndex]);

  useEffect(() => {
    if (selectedTabIndex === 2) { // Assuming index 2 is for Pending Requests
      const fetchPendingRequests = async () => {
        try {
          const response = await axios.get('/api/pending-requests', { params: { userId: session.user.id } });
          setPendingRequests(response.data.requests);
        } catch (error) {
          toast.error("Failed to fetch pending requests");
        }
      };
      fetchPendingRequests();
    }
  }, [selectedTabIndex, session?.user?.id]);

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
            <Tab.Panel>Content 2</Tab.Panel>
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