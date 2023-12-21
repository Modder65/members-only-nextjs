'use client'

import { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import { toast } from "react-hot-toast";
import { FiMessageSquare } from "react-icons/fi";
import { pusherClient } from "@/app/libs/pusher";
import { notifyNewComment } from "@/Custom-Toast-Messages/Notify";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/features/modalSlice";
import { setCommentsForPost, updateCommentForPost } from "@/redux/features/commentsSlice";
import axios from "axios";
import PostLikeIcon from "./PostLikeIcon";
import Image from "next/image";
import Avatar from "./Avatar";


const PostItem = ({ post, postId, initialCommentsCount, initialLikesCount, currentUserLiked }) => {
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentsCount);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  
  const fetchComments = async () => {
    // Check if comments have already been loaded or if there are no comments to load
    if (!commentsLoaded && initialCommentsCount > 0) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/comments?postId=${postId}`);
        dispatch(setCommentsForPost({ postId, comments: response.data }));
        setCommentsLoaded(true);
      } catch (error) {
        toast.error("Failed to fetch comments");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openModalHandler = async () => {
    await fetchComments();
    dispatch(openModal({ post }));
  }

  const commentHandler = useCallback((comment) => {
    if (comment.postId === postId) {
      dispatch(updateCommentForPost({ postId, comment }));
      setCommentCount(currentCount => currentCount + 1);
      notifyNewComment(post.title);
    }
  }, [postId, post.title, dispatch]);

  useEffect(() => {
    pusherClient.subscribe("comments-channel");
    pusherClient.bind("comment:created", commentHandler)

    return () => {
      pusherClient.unsubscribe("comments-channel");
      pusherClient.unbind("comment:created", commentHandler);
    }
  }, [commentHandler]);

  return (
    <div className="max-auto max-w-6xl px-5 mb-5">
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Avatar user={post.user}/>
          <h2 className=" text-xl font-bold">{post.title}</h2>
        </div>
        <p className="mb-3">{post.message}</p>
        {post.image && 
          <Image alt="hello" src={post.image} width={100} height={100} priority={true} /> // check priorty parameter documentation; caused warning in console without it related to LCP
        }
        <p className="text-sm text-gray-500 mt-2.5 border-t border-gray-200 pt-2.5">
          Posted by {post.user.name} on {
            DateTime.fromISO(post.createdAt).toLocaleString({
              month: 'numeric',
              day: 'numeric',
              year: '2-digit',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          }
        </p>
        <div className="flex justify-between items-center mt-3">
          <button onClick={openModalHandler}
           className="bg-blue-600 rounded-md px-2 py-1 text-white hover:opacity-80 flex items-center"
           >
            <FiMessageSquare className="mr-2" />
            {`Show Comments (${commentCount})`}
          </button>
          <PostLikeIcon postId={postId} initialLikesCount={initialLikesCount} currentUserLiked={currentUserLiked}/>
        </div>
      </div>
    </div>
  );
}
 
export default PostItem;


