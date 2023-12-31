"use client"

import { useState, useRef, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { notifyLike } from "@/Custom-Toast-Messages/Notify";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { togglePostLike } from "@/redux/features/likesSlice";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import gsap from "gsap";
import axios from "axios";


const PostLikeIcon = ({ postId, initialLikesCount, currentUserLiked }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isLoading, setIsLoading] = useState(false);
  const heartIconRef = useRef(null);
  
  const postLikes = useSelector((state) => state.likes.posts[postId]);
  // falls back to props for initial state values
  const isLiked = postLikes?.userLikes[userId] ?? currentUserLiked;
  const likeCount = postLikes?.likeCount ?? initialLikesCount;

  const handleToggleLike = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/like-post', { postId });
      const { likeCount, userLikedPost } = response.data;

      dispatch(togglePostLike({ postId, userId, isLiked: userLikedPost, likeCount }));

      animateHeartIcon();
      notifyLike();
    } catch (error) {
      toast.error('Error updating like.');
    } finally {
      setIsLoading(false);
    }
  };

  const animateHeartIcon = () => {
    gsap.fromTo(
      heartIconRef.current,
      { scale: 1 },
      { scale: 1.5, duration: 0.2, ease: 'power1.out', yoyo: true, repeat: 1 }
    );
  };

  return ( 
    <div className="flex items-center mt-2">
    <button
      className="flex items-center"
      onClick={handleToggleLike}
      disabled={isLoading}
    >
      <span style={{ opacity: likeCount > 0 ? 1 : 0, minWidth: '10px' }}>
        {likeCount}
      </span>
      <span ref={heartIconRef} className="text-rose-600">
        <FiHeart size={20} className={clsx('ml-1', {'fill-current': isLiked})} />
      </span>
    </button>
  </div>
   );
}
 
export default PostLikeIcon;