'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import { DateTime } from "luxon";
import { toast } from "react-hot-toast";
import { FiMessageSquare } from "react-icons/fi";
import { pusherClient } from "@/app/libs/pusher";
import { notifyNewComment } from "@/Custom-Toast-Messages/Notify";
import axios from "axios";
import PostLikeIcon from "./PostLikeIcon";
import PostModal from "./PostModal";


const PostItem = ({ post, postId, initialCommentsCount, initialLikesCount, currentUserLiked }) => {
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentsCount);
  const [showModal, setShowModal] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  

  const fetchComments = async () => {
    // Check if comments have already been loaded or if there are no comments to load
    if (!commentsLoaded && initialCommentsCount > 0) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/comments?postId=${postId}`);
        setComments(response.data);
        setCommentsLoaded(true);
      } catch (error) {
        toast.error("Failed to fetch comments");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openModal = async () => {
    await fetchComments();
    setShowModal(true);
  }

  const closeModal = () => setShowModal(false);

  const commentHandler = useCallback((comment) => {
    if (comment.postId === postId) {
      setComments(current => {
        // If a comment with this ID already exists in the current state, don't add it
        if (!find(current, { id: comment.id })) {
          return [comment, ...current];
        }
        return current;
      });
      setCommentCount(currentCount => currentCount + 1);
      notifyNewComment(post.title);
    }
  }, [postId, post.title]);

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
        <h2 className="mb-5 text-xl font-bold">{post.title}</h2>
        <p>{post.message}</p>
        <p className="text-sm text-gray-500 mt-2.5 border-t border-gray-200 pt-2.5">
          Posted by {post.user.name} on {
            DateTime.fromISO(post.createdAt).toLocaleString({
              ...DateTime.DATE_FULL,
              ...DateTime.TIME_SIMPLE
            })
          }
        </p>
        <div className="flex justify-between items-center mt-3">
          <button onClick={openModal}
           className="bg-green-600 rounded-md px-2 py-1 text-white hover:opacity-80 flex items-center"
           >
            <FiMessageSquare className="mr-2" />
            {`Show Comments (${commentCount})`}
          </button>
          <PostLikeIcon postId={postId} initialLikesCount={initialLikesCount} currentUserLiked={currentUserLiked}/>
        </div>
          <PostModal 
          post={post} 
          postId={post.id} 
          isOpen={showModal}
          onClose={closeModal} 
          comments={comments}
          setComments={setComments}
          />
      </div>
    </div>
  );
}
 
export default PostItem;


