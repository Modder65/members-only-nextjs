"use client"

import { useParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setFriendshipStatus } from "@/redux/features/accountSlice";
import { useSession } from "next-auth/react";
import { Tab } from '@headlessui/react'
import { toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { GoPlus } from "react-icons/go";
import { CustomLoader } from '@/components/CustomLoader';
import axios from 'axios';
import Avatar from '../components/Avatar';
import PostList from '../components/PostList';


const UserProfile = () => {
  const params = useParams();
  const userId = params.id;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [friendButtonText, setFriendButtonText] = useState('Friend');
  const [loading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  
  const dispatch = useDispatch();
  const { userData, friendshipStatus } = useSelector((state) => state.account);

  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/user-data?userId=${userId}`);
        dispatch(setUserData(response.data)); // Dispatch to Redux store
      } catch (error) {
        toast.error("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

  const sendFriendRequest = async () => {
    try {
      const response = await axios.post('/api/send-friend-request', {
        userId: session?.user?.id,
        friendId: userId,
      });
      dispatch(setFriendshipStatus(response.data)); // Update Redux state
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error("Failed to send friend request");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-5">
      <div className="flex justify-between items-center">
        <div className='flex gap-2 items-center mb-5'>
          <Avatar user={userData}/>
          <p className="text-lg font-semibold">{userData?.name}</p>
        </div>
        <button type="button"
          className="
            flex 
            items-center
            gap-2
          bg-blue-600
            rounded-md
            px-2
            py-1
            text-white
            hover:opacity-80
          "
          onClick={sendFriendRequest}
          disabled={friendshipStatus === 'PENDING'}
        >
          {friendButtonText}
          <GoPlus size={25} />
        </button>
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
                  Posts
                </button>
              )}
            </Tab>
            {/* Repeat for other tabs */}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>Content 1</Tab.Panel>
            <Tab.Panel>Content 2</Tab.Panel>
            <Tab.Panel>
              <PostList posts={userData?.posts}/>
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

export default UserProfile;