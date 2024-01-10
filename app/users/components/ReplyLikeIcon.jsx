"use client"

import { useState, useRef } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { notifyLike } from "@/Custom-Toast-Messages/Notify";
import { useDispatch, useSelector } from "react-redux";
//import { toggleReplyLike } from "@/redux/features/likesSlice"; 
import { useCurrentUser } from "@/hooks/use-current-user";
import clsx from "clsx";
import gsap from "gsap";
import axios from "axios";

const ReplyLikeIcon = ({ replyId, initialLikesCount, currentUserLiked }) => {
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const userId = user.id;

  const replyLikes = useSelector((state) => state.likes.replies[replyId]);
  const isLiked = replyLikes?.userLikes[userId] ?? currentUserLiked;
  const likeCount = replyLikes?.likeCount ?? initialLikesCount;

  const heartIconRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLike = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/like-reply', { replyId });
      const { likeCount, userLikedReply } = response.data;

      // Dispatch action to update global state
      dispatch(toggleReplyLike({ replyId, userId, isLiked: userLikedReply, likeCount }));

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
    <div className="flex justify-end items-center">
      <button
        className="flex items-center"
        onClick={handleToggleLike}
        disabled={isLoading}
      >
        <span ref={heartIconRef} className="text-rose-600">
          <FiHeart className={clsx('mr-1', {'fill-current': isLiked})} />
        </span>
        <span style={{ opacity: likeCount > 0 ? 1 : 0 }}>
          {likeCount}
        </span>
      </button>
    </div>
   );
}
 
export default ReplyLikeIcon;