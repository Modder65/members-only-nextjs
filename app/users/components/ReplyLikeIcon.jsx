"use client"

import { useState, useRef, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { notifyLike } from "@/Custom-Toast-Messages/Notify";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReplyLike } from "@/redux/features/likesSlice"; 
import clsx from "clsx";
import gsap from "gsap";
import axios from "axios";

const ReplyLikeIcon = ({ replyId, initialLikesCount, currentUserLiked }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const userId = session?.user?.id;

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

  useEffect(() => {
    const handleLikeUpdate = (data) => {
      if (data.replyId === replyId) {
        // Dispatch action for real-time updates
        dispatch(toggleReplyLike({
          replyId: data.replyId,
          userId: data.actionUserId,
          isLiked: data.userLikedReply,
          likeCount: data.likeCount
        }));
      }
    };

    pusherClient.subscribe("likes-channel");
    pusherClient.bind("reply:liked", handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("reply:liked", handleLikeUpdate);
    };
  }, [replyId, dispatch]);

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