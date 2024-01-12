"use client"

import { useState, useRef, useMemo } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import { notifyLike } from "@/Custom-Toast-Messages/Notify";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "@/redux/features/likesSlice";
import clsx from "clsx";
import gsap from "gsap";
import axios from "axios";


const CommentLikeIcon = ({ commentId }) => {
  const dispatch = useDispatch();
  const likeState = useSelector((state) => state.likes.comments[commentId]);
  const { currentUserLiked, likeCount } = useMemo(() => {
    return likeState || { currentUserLiked: false, likeCount: 0 };
  }, [likeState]);
  
  const heartIconRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLike = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/like-comment', { commentId });
      const { likeCount } = response.data;
      dispatch(toggleLike({ 
        commentId, 
        likeCount,
        currentUserLiked: !currentUserLiked
      }));
      toast.success('Updated Like!');
      animateHeartIcon();
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
          <FiHeart className={clsx('mr-1', {'fill-current': currentUserLiked})} />
        </span>
        <span style={{ opacity: likeCount > 0 ? 1 : 0 }}>
          {likeCount}
        </span>
      </button>
    </div>
   );
}
 
export default CommentLikeIcon;