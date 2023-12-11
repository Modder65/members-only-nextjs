"use client"

import { useState, useRef, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { notifyLike } from "@/Custom-Toast-Messages/Notify";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import gsap from "gsap";
import axios from "axios";

const LikeIcon = ({ postId, initialLikesCount }) => {
  const [isLiked, setIsLiked] = useState(initialLikesCount > 0);
  const [likeCount, setLikeCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const heartIconRef = useRef(null);
  const { data: session } = useSession();

  const toggleLike = async () => {
    setIsLoading(true);
    const newLikeState = !isLiked;

    // Optimistically update the UI
    setIsLiked(newLikeState);
    setLikeCount(newLikeState ? likeCount + 1 : likeCount - 1);
    animateHeartIcon();

    try {
      await axios.post('/api/like-post', { postId });
    } catch (error) {
      // Revert UI changes on error
      setIsLiked(!newLikeState);
      setLikeCount(newLikeState ? likeCount - 1 : likeCount + 1);
      toast.error("Error updating like.");
    } finally {
      setIsLoading(false);
    }
  };

  const animateHeartIcon = () => {
    gsap.fromTo(heartIconRef.current, 
      { scale: 1 }, 
      { scale: 1.5, duration: 0.2, ease: "power1.out", yoyo: true, repeat: 1 });
  };

  useEffect(() => {
    const handleLikeUpdate = (data) => {

      console.log("Pusher data:", data);
      console.log("Current isLiked:", isLiked);
      console.log("Session user ID:", session.user.id);
 
      if (data.postId === postId) {
        setLikeCount(data.likeCount);

        // Determine if the current user has liked the post
        const userLikedPost = data.actionUserId === session.user.id 
                              ? data.likeCount > 0 
                              : (data.likeCount > 0 && isLiked);

        setIsLiked(userLikedPost);
        console.log("Updated isLiked:", userLikedPost);
      }
    };

    pusherClient.subscribe("likes-channel");
    pusherClient.bind("post:liked", handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("post:liked", handleLikeUpdate); 
    };
  }, [postId, session.user.id, isLiked]);


  return ( 
    <div className="flex items-center mt-2">
    <button
      className="flex items-center"
      onClick={toggleLike}
      disabled={isLoading}
    >
      <span ref={heartIconRef} className="text-rose-600">
        <FiHeart className={clsx('mr-1', {'fill-current': isLiked})} />
      </span>
      <span style={{ opacity: likeCount > 0 ? 1 : 0, minWidth: '10px' }}>
        {likeCount}
      </span>
    </button>
  </div>
   );
}
 
export default LikeIcon;