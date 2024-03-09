"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
} from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { toast } from "sonner";
import { GoPlus } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from '@/hooks/use-current-user';
import { DateTime } from 'luxon';
import { FriendshipPayload, TabValue } from '@/types/types';
import useAccountStore from '@/zustand/accountStore';
import axios from 'axios';
import Link from "next/link";

const UserProfile = () => {
  const params = useParams();
  const userId = params.id;
  const user = useCurrentUser();
  const [loading, setIsLoading] = useState<boolean>(false);

  const { setUserData, setFriendshipStatus, setFriendButtonText, userData, friendshipStatus, friendButtonText } = useAccountStore(state => ({
    setUserData: state.setUserData,
    setFriendshipStatus: state.setFriendshipStatus,
    setFriendButtonText: state.setFriendButtonText,
    userData: state.userData,
    friendshipStatus: state.friendshipStatus,
    friendButtonText: state.friendButtonText
  }));

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/user-data?userId=${userId}`);
        setUserData(response.data.userData); 
  
        // Extract friendship status from the response
        const currentStatus: string = response.data.friendshipStatus;
        setFriendshipStatus(currentStatus); 
  
        // Update button text based on friendship status
        if (currentStatus === 'PENDING') {
          setFriendButtonText('Pending...');
        } else if (currentStatus === 'ACCEPTED') {
          setFriendButtonText("You're Friends");
        } else {
          setFriendButtonText('Friend');
        }
      } catch (error) {
        toast.error("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    }, [setFriendButtonText, setFriendshipStatus, setUserData, userId]);

  const sendFriendRequest = async () => {
    try {
      const response = await axios.post('/api/send-friend-request', {
        userId: user?.id,
        friendId: userId,
      });
      setFriendshipStatus(response.data); 
      setFriendButtonText('Pending...'); 
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error("Failed to send friend request");
    }
  };
  
  return (
    <div className="mx-auto max-w-3xl px-5 py-5">
      <div>
      <Tabs defaultValue="about" className="w-full" >
        <TabsList className="flex justify-center gap-x-2.5 w-full shadow-md mb-8 mt-8">
          <TabsTrigger value="about" className="h-9 px-4 py-2">About</TabsTrigger>
          <TabsTrigger value="friends" className="h-9 px-4 py-2">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <Card>
            <div className="flex justify-between items-center p-6 pb-0">
              <div className='flex gap-2 items-center'>
                <Avatar>
                  <AvatarImage src={userData?.image || ""}/>
                  <AvatarFallback>
                    <FaUser className="text-white"/>
                  </AvatarFallback>
                </Avatar>
                <p className="text-lg font-semibold">{userData?.name}</p>
              </div>
              <button type="button"
                className={`flex items-center gap-2 rounded-md px-2 py-1 text-white hover:opacity-80 ${
                  friendshipStatus === 'ACCEPTED' ? "bg-emerald-600" : 
                  friendshipStatus === 'PENDING' ? "bg-orange-600" : "bg-blue-600"
                } disabled:pointer-events-none`}
                disabled={friendshipStatus === 'PENDING' || friendshipStatus === 'ACCEPTED'}
                onClick={!friendshipStatus ? sendFriendRequest : undefined}
              >
                {friendButtonText}
                {friendshipStatus !== 'PENDING' && friendshipStatus !== 'ACCEPTED' && <GoPlus size={25} />}
              </button>
            </div>
            <CardHeader>
              <h2 className="text-xl font-bold">About</h2>
            </CardHeader>
            <CardContent>
              <p>Member Since: {
                  DateTime.fromISO(userData?.createdAt).toLocaleString({
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
            <div className="flex justify-between items-center p-6 pb-0">
              <div className='flex gap-2 items-center'>
                <Avatar>
                  <AvatarImage src={userData?.image || ""}/>
                  <AvatarFallback>
                    <FaUser className="text-white"/>
                  </AvatarFallback>
                </Avatar>
                <p className="text-lg font-semibold">{userData?.name}</p>
              </div>
              <button type="button"
                className={`flex items-center gap-2 rounded-md px-2 py-1 text-white hover:opacity-80 ${
                  friendshipStatus === 'ACCEPTED' ? "bg-emerald-600" : 
                  friendshipStatus === 'PENDING' ? "bg-orange-600" : "bg-blue-600"
                } disabled:pointer-events-none`}
                disabled={friendshipStatus === 'PENDING' || friendshipStatus === 'ACCEPTED'}
                onClick={!friendshipStatus ? sendFriendRequest : undefined}
              >
                {friendButtonText}
                {friendshipStatus !== 'PENDING' && friendshipStatus !== 'ACCEPTED' && <GoPlus size={25} />}
              </button>
            </div>
            <CardHeader>
              <h2 className="text-xl font-bold">Friends</h2>
            </CardHeader>
            <CardContent>
              {userData && (userData.userFriendships.length > 0 || userData.friendUserFriendships.length > 0) ? (
                <div className="space-y-2">
                  {/* Display friends where the user is the initiator */}
                  {userData.userFriendships.map((friendship: FriendshipPayload) => (
                    <div key={friendship.friend.id} className="flex items-center justify-between border-b-2 border-skin-fill py-5">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={friendship.friend.image || ""}/>
                          <AvatarFallback>
                            <FaUser className="text-white"/>
                          </AvatarFallback>
                        </Avatar>
                        <p>{friendship.friend.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Display friends where the user is the recipient */}
                  {userData.friendUserFriendships.map((friendship: FriendshipPayload) => (
                    <div key={friendship.user.id} className="flex items-center justify-between border-b-2 border-skin-fill py-5">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={friendship.user.image || ""}/>
                          <AvatarFallback>
                            <FaUser className="text-white"/>
                          </AvatarFallback>
                        </Avatar>
                        {friendship.user.id !== user?.id ? (
                          <Link href={`/users/${friendship.user.id}`} className="text-blue-600 hover:underline">
                            <span className="text-blue-600 hover:underline cursor-pointer">{friendship.user.name}</span>
                          </Link>
                        ) : (
                          <span>{friendship.user.name}</span>
                        )}
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