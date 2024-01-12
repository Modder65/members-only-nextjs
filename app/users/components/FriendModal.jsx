"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from "next-auth/react";
import { Dialog } from '@headlessui/react'
import { CustomLoader } from '@/components/CustomLoader';
import { useGSAP } from '@gsap/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from "@/redux/features/friendsModalSlice";
import { setFriends } from '@/redux/features/accountSlice';
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-hot-toast";
import Link from "next/link";
import gsap from "gsap";
import axios from "axios"
import Avatar from './Avatar';



function FriendsModal() {
  const { data: session } = useSession();
  const modalRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialFriendsLoad, setInitialFriendsLoad] = useState(false);
  
  const { isModalOpen } = useSelector(state => state.friendsModal);

  const { friends } = useSelector(state => state.account);

  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user) {
      const fetchData = async () => {
        setIsLoading(true);
        setInitialFriendsLoad(true);
        try {
            const friendsResponse = await axios.get('/api/friends');
            dispatch(setFriends(friendsResponse.data));
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
        };
        if (!initialFriendsLoad) {
            fetchData();
        }
    }
  }, [session?.user]);

  const handleClose = () => {
    // Ensure the element exists and no ongoing animation
    if (modalRef.current) {
      // Kill any ongoing animations
      gsap.killTweensOf(modalRef.current); // make sure no other animations are running on the same element that could interfere with the closing animation

      const closingTl = gsap.timeline({
        onComplete: () => dispatch(closeModal()),
      });
  
      closingTl.to(modalRef.current, {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.out',
      });
    } else {
      dispatch(closeModal());
    }
  };

  const handleDeclineRequest = async (friendRequestId) => {
    try {
      await axios.post('/api/decline-friend-request', { friendRequestId });
      toast.success("Friend request declined");
    } catch (error) {
      toast.error("Failed to decline friend request");
    }
  };

  // Modal open animation
  useGSAP(() => {
    // Create a timeline with the open animation
    if (isModalOpen) {
      const tl = gsap.timeline();

      tl.fromTo(
        modalRef.current,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isModalOpen]);

  // Friends stagger animation
  useGSAP(() => {
    if (containerRef.current && friends.length > 0) {
      gsap.from(containerRef.current.querySelectorAll('.friend-item'), {
        opacity: 0,
        y: -20,
        stagger: 0.15,
        ease: 'power1.out',
        duration: 0.5
      });
    }
  }, { dependencies: []});


  return (
    
    <Dialog onClose={handleClose} open={isModalOpen} className="relative z-50 px-5">
      <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4" ref={modalRef}>
        <Dialog.Panel className="w-full max-w-lg rounded px-5 py-5 bg-white" ref={containerRef}>
          <div className="flex justify-between">
            <Dialog.Title className="text-xl font-bold">Friends</Dialog.Title>
            <IoCloseSharp onClick={handleClose} size={25} className="cursor-pointer text-rose-600"/>
          </div>
          <div className="fade-container">
            <div className="mt-4 max-h-[400px] overflow-y-auto scrollbar-custom pb-24">
              {friends.map(friendship => (
                <div key={friendship.id} className="friend-item flex items-center justify-between border-b-2 border-gray-700 py-5">
                    <div className="flex items-center gap-2">
                      <Avatar user={session.user.id === friendship.senderId ? friendship.friend : friendship.user}/>
                      <Link href={`/users/${session.user.id === friendship.senderId ? friendship.friend.id : friendship.user.id}`} className="text-blue-600 hover:underline">
                        <span className="text-blue-600 hover:underline cursor-pointer">{session.user.id === friendship.senderId ? friendship.friend.name : friendship.user.name}</span>
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button type="button"
                        className="bg-rose-600 rounded-md px-2 py-1 text-white hover:opacity-80"
                        onClick={() => handleDeclineRequest(friendship.id)}
                      >
                        Unfriend
                      </button>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
  
}

export default FriendsModal;