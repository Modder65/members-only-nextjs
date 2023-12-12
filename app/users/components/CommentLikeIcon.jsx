"use client"

import { useState, useRef, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { notifyLike } from '@/Custom-Toast-Messages/Notify';
import { pusherClient } from '@/app/libs/pusher';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import gsap from 'gsap';
import axios from 'axios';
import { useLikes } from '@/app/context/LikesContext';

const CommentLikeIcon = ({ commentId, initialLikesCount, currentUserLiked }) => {
  const { state, dispatch } = useLikes(); // Use the global likes state
  const isLiked = state.commentLikes[commentId] ?? currentUserLiked; // Get the like status from the global state
  const [likeCount, setLikeCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const heartIconRef = useRef(null);
  const { data: session } = useSession();

  const toggleLike = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/like-comment', { commentId });
      const { likeCount, userLikedComment } = response.data;

      // Dispatch action to update global state
      dispatch({
        type: 'TOGGLE_COMMENT_LIKE',
        payload: { commentId, isLiked: userLikedComment },
      });

      setLikeCount(likeCount);
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
      if (data.commentId === commentId) {
        setLikeCount(data.likeCount);

        if (data.actionUserId === session.user.id) {
          dispatch({
            type: 'TOGGLE_COMMENT_LIKE',
            payload: { commentId, isLiked: data.userLikedComment },
          });
        }
      }
    };

    pusherClient.subscribe('likes-channel');
    pusherClient.bind('comment:liked', handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe('likes-channel');
      pusherClient.unbind('comment:liked', handleLikeUpdate);
    };
  }, [commentId, session?.user?.id, dispatch]);

  return (
    <div className='flex justify-end items-center'>
      <button
        className='flex items-center'
        onClick={toggleLike}
        disabled={isLoading}
      >
        <span ref={heartIconRef} className='text-rose-600'>
          <FiHeart className={clsx('mr-1', { 'fill-current': isLiked })} />
        </span>
        <span style={{ opacity: likeCount > 0 ? 1 : 0 }}>
          {likeCount}
        </span>
      </button>
    </div>
  );
};

export default CommentLikeIcon;
