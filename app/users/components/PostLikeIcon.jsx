"use client"

import { useState, useRef } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "@/redux/features/likesSlice";
import clsx from "clsx";
import gsap from "gsap";
import axios from "axios";

const PostLikeIcon = ({ postId }) => {
  const dispatch = useDispatch();
  const { currentUserLiked, likeCount } = useSelector((state) => state.likes.posts[postId] || { currentUserLiked: false, likeCount: 0 });
  
  const [isLoading, setIsLoading] = useState(false);
  const heartIconRef = useRef(null);
  


  const handleToggleLike = async () => {
    setIsLoading(true);
    try {
      // Make sure 'itemType' is correctly set to 'POST'
      const response = await axios.post('/api/like-post', { postId });
      const { likeCount } = response.data;
      dispatch(toggleLike({ 
        postId, 
        likeCount,
        currentUserLiked: !currentUserLiked
      }));
      toast.success('Updated Like!');
      animateHeartIcon();
    } catch (error) {
      toast.error('Error updating like');
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
      className="flex items-center gap-x-1.5 font-bold"
      onClick={handleToggleLike}
      disabled={isLoading}
    >
      <span style={{ opacity: likeCount > 0 ? 1 : 0, minWidth: '10px' }}>
        {likeCount}
      </span>
      <span ref={heartIconRef} className="text-rose-600">
        {!currentUserLiked && (
          <FaRegHeart className="w-6 h-6" />
        )}
        {currentUserLiked && (
          <FaHeart className="w-6 h-6" />
        )}
      </span>
    </button>
  </div>
   );
}
 
export default PostLikeIcon;