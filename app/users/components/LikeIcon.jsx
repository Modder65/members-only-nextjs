"use client"

import { useState, useRef, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { notifyLike } from "@/Custom-Toast-Messages/Notify";
import { pusherClient } from "@/app/libs/pusher";
import clsx from "clsx";
import gsap from "gsap";
import axios from "axios";

const LikeIcon = ({ postId, initialLikesCount }) => {
  const [isLiked, setIsLiked] = useState(initialLikesCount > 0);
  const [likeCount, setLikeCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const heartIconRef = useRef(null);

  const toggleLike = async () => {
    const newLikeState = !isLiked;
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
    }
  };

  const animateHeartIcon = () => {
    gsap.fromTo(heartIconRef.current, 
      { scale: 1 }, 
      { scale: 1.5, duration: 0.2, ease: "power1.out", yoyo: true, repeat: 1 });
  };

  useEffect(() => {
    pusherClient.subscribe("likes-channel");
    pusherClient.bind("post:liked", (data) => {
      if (data.postId === postId) {
        setLikeCount(data.likeCount);
        setIsLiked(data.likeCount > 0);
      }
    });

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("post:liked");
    }
  }, [postId]);


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