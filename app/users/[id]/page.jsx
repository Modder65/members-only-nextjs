"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setOthersPosts, setFriendshipStatus, setFriendButtonText, setOthersPostsLoaded } from "@/redux/features/accountSlice";
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
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { GoPlus } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from '@/hooks/use-current-user';
import { DateTime } from 'luxon';
import axios from 'axios';
import Link from "next/link";

const UserProfile = () => {
  const params = useParams();
  const userId = params.id;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const user = useCurrentUser();
  
  const dispatch = useDispatch();
  const { userData, friendshipStatus, friendButtonText } = useSelector((state) => state.account);

  const [ref, inView] = useInView({
    threshold: 0,
  });

  const handleTabChange = (tabValue) => {
    // Map the tab value to its corresponding index
    const tabIndexMap = {
      "about": 0,
      "friends": 1,
    };
    setSelectedTabIndex(tabIndexMap[tabValue]);
  };


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

  useEffect(() => {
    fetchUserData();
    }, [userId, dispatch]);

  const sendFriendRequest = async () => {
    try {
      const response = await axios.post('/api/send-friend-request', {
        userId: user?.id,
        friendId: userId,
      });
      dispatch(setFriendshipStatus(response.data)); // Update Redux state
      dispatch(setFriendButtonText('Pending...')); // Update button text
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error("Failed to send friend request");
    }
  };
  

  console.log(userData);
  return (
    <div className="mx-auto max-w-3xl px-5 py-5">
      <Card className="mb-5">
        <CardListItem>
          <div className="flex justify-between items-center">
            <div className='flex gap-2 items-center'>
              <Avatar>
                <AvatarImage src={userData?.image || ""}/>
                <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                  from-green-400 to-green-800">
                  <FaUser className="text-white"/>
                </AvatarFallback>
              </Avatar>
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
        </CardListItem>
      </Card>
      
      <div>
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
          {/* Display the user's friends */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold mb-4">Friends</h2>
            </CardHeader>
            <CardContent>
              {userData && (userData.userFriendships.length > 0 || userData.friendUserFriendships.length > 0) ? (
                <div className="space-y-2">
                  {/* Display friends where the user is the initiator */}
                  {userData.userFriendships.map(friendship => (
                    <div key={friendship.friend.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={friendship.friend.image || ""}/>
                          <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                            from-green-400 to-green-800">
                            <FaUser className="text-white"/>
                          </AvatarFallback>
                        </Avatar>
                        <p>{friendship.friend.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Display friends where the user is the recipient */}
                  {userData.friendUserFriendships.map(friendship => (
                    <div key={friendship.user.id} className="flex items-center justify-between border-b-2 border-gray-700 py-5">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={friendship.user.image || ""}/>
                          <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                            from-green-400 to-green-800">
                            <FaUser className="text-white"/>
                          </AvatarFallback>
                        </Avatar>
                        <Link href={`/users/${friendship.user.id}`} className="text-blue-600 hover:underline">
                          <span className="text-blue-600 hover:underline cursor-pointer">{friendship.user.name}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p>{`They have no friends :(`}</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;