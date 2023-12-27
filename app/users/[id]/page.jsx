"use client"

import { useParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setFriendshipStatus, setFriendButtonText } from "@/redux/features/accountSlice";
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
  const [loading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  
  const dispatch = useDispatch();
  const { userData, friendshipStatus, friendButtonText } = useSelector((state) => state.account);

  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/user-data?userId=${userId}`);
        dispatch(setUserData(response.data.userData)); // Dispatch userData to Redux store
  
        // Extract friendship status from the response
        const currentStatus = response.data.friendshipStatus;
        dispatch(setFriendshipStatus(currentStatus)); // Update Redux state with the current friendship status
  
        // Update button text based on friendship status
        if (currentStatus === 'PENDING') {
          dispatch(setFriendButtonText('Pending...'));
        } else if (currentStatus === 'ACCEPTED') {
          dispatch(setFriendButtonText('Friends'));
        } else {
          dispatch(setFriendButtonText('Friend'));
        }
      } catch (error) {
        toast.error("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, [userId, dispatch]); // Remove friendshipStatus from the dependency array
  

  const sendFriendRequest = async () => {
    try {
      const response = await axios.post('/api/send-friend-request', {
        userId: session?.user?.id,
        friendId: userId,
      });
      dispatch(setFriendshipStatus(response.data)); // Update Redux state
      dispatch(setFriendButtonText('Pending...')); // Update button text
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
          className={`flex items-center gap-2 rounded-md px-2 py-1 text-white hover:opacity-80 ${
              friendshipStatus === 'ACCEPTED' ? 'bg-green-600' :
              friendshipStatus === 'PENDING' ? 'bg-orange-500' : // Orange/yellow color for PENDING
              'bg-blue-600' // Default color
          }`}
          onClick={sendFriendRequest}
          disabled={friendshipStatus === 'PENDING' || friendshipStatus === 'ACCEPTED'}
        >
          {friendButtonText}
          {friendshipStatus !== 'PENDING' && friendshipStatus !== 'ACCEPTED' && <GoPlus size={25} />}
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
            <Tab.Panel>Content 0</Tab.Panel>
            <Tab.Panel>
               {/* Display the user's friends */}
               <h2 className="text-xl font-bold mb-4">Friends</h2>
              {userData && (userData.userFriendships.length > 0 || userData.friendUserFriendships.length > 0) ? (
                <div className="space-y-2">
                  {/* Display friends where the user is the initiator */}
                  {userData.userFriendships.map(friendship => (
                    <div key={friendship.friend.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                      <div className="flex items-center gap-2">
                        <Avatar user={friendship.friend}/>
                        <p>{friendship.friend.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Display friends where the user is the recipient */}
                  {userData.friendUserFriendships.map(friendship => (
                    console.log("Friend Id:", friendship.id),
                    <div key={friendship.user.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                      <div className="flex items-center gap-2">
                        <Avatar user={friendship.user}/>
                        <p>{friendship.user.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p>No friends to show.</p>}
            </Tab.Panel>
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