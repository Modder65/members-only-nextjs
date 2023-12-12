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
import { togglePostLike } from "@/redux/features/likesSlice";
import { useDispatch, useSelector } from "react-redux";

const PostLikeIcon = ({ postId, initialLikesCount, currentUserLiked }) => {
  const dispatch = useDispatch();

  const { isLiked, likeCount } = useSelector((state) => state.likes.posts[postId]) || {
    isLiked: currentUserLiked,
    likeCount: initialLikesCount,
  };

  const [isLoading, setIsLoading] = useState(false);
  const heartIconRef = useRef(null);
  const { data: session } = useSession();

  const handleToggleLike = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/like-post', { postId });
      const { likeCount, userLikedPost } = response.data;

      dispatch(togglePostLike({ postId, isLiked: userLikedPost, likeCount }));

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
      if (data.postId === postId) {
        setLikeCount(data.likeCount);

        // Update isLiked only if the action is performed by the current user
        if (data.actionUserId === session.user.id) {
          setIsLiked(data.userLikedPost);
        }
      }
    };

    pusherClient.subscribe("likes-channel");
    pusherClient.bind("post:liked", handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("post:liked", handleLikeUpdate); 
    };
  }, [postId, session?.user?.id]);

  /*
  const [isLiked, setIsLiked] = useState(currentUserLiked);
  const [likeCount, setLikeCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const heartIconRef = useRef(null);
  const { data: session } = useSession();

  
  const toggleLike = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/like-post', { postId });
      const { likeCount, userLikedPost } = response.data;

      // Update UI based on server response
      setIsLiked(userLikedPost);
      setLikeCount(likeCount);
      animateHeartIcon();

      notifyLike();
    } catch (error) {
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
      if (data.postId === postId) {
        setLikeCount(data.likeCount);

        // Update isLiked only if the action is performed by the current user
        if (data.actionUserId === session.user.id) {
          setIsLiked(data.userLikedPost);
        }
      }
    };

    pusherClient.subscribe("likes-channel");
    pusherClient.bind("post:liked", handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("post:liked", handleLikeUpdate); 
    };
  }, [postId, session?.user?.id]);
  */


  return ( 
    <div className="flex items-center mt-2">
    <button
      className="flex items-center"
      onClick={handleToggleLike}
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
 
export default PostLikeIcon;