"use client"

import { useState, useRef } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, useAnimation } from "framer-motion";
import useLikesStore from "@/zustand/likesStore";
import axios from "axios";

const PostLikeIcon = ({ postId }) => {
  const { currentUserLiked, likeCount, toggleLike } = useLikesStore((state) => {
    const postLikes = state.posts[postId] || { currentUserLiked: false, likeCount: 0 }; // Default to false and 0 if postId not found
    return {
      currentUserLiked: postLikes.currentUserLiked,
      likeCount: postLikes.likeCount,
      toggleLike: state.toggleLike,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const heartIconRef = useRef(null);
  const controls = useAnimation();
  
  const handleToggleLike = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Make sure 'itemType' is correctly set to 'POST'
      const response = await axios.post('/api/like-post', { postId });
      const { likeCount } = response.data;
      toggleLike({ 
        postId, 
        likeCount,
        currentUserLiked: !currentUserLiked
      });
      toast.success('Updated Like!');
      controls.start({
        scale: [1, 1.5, 1],
        transition: { duration: 0.4, ease: 'easeInOut' },
      })
    } catch (error) {
      toast.error('Error updating like');
    } finally {
      setIsLoading(false);
    }
  };
  

  return ( 
    <div className="flex items-center mt-2">
    <button
      className="flex items-center gap-x-1.5 font-bold"
      onClick={handleToggleLike}
      disabled={isLoading}
    >
      <motion.span animate={controls} style={{ opacity: likeCount > 0 ? 1 : 0, minWidth: '10px' }}>
        {likeCount}
      </motion.span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.span animate={controls} ref={heartIconRef} className="text-skin-icon-accent hover:text-skin-icon-accent-hover">
              {!currentUserLiked && (
                <FaRegHeart className="w-6 h-6" />
              )}
              {currentUserLiked && (
                <FaHeart className="w-6 h-6" />
              )}
            </motion.span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Like Post</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </button>
  </div>
   );
}
 
export default PostLikeIcon;