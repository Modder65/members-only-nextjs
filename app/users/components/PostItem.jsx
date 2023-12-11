'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiMessageSquare } from "react-icons/fi";
import { pusherClient } from "@/app/libs/pusher";
import { notifyNewComment } from "@/Custom-Toast-Messages/Notify";
import CommentsSection from "./CommentsSection";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import LikeIcon from "./LikeIcon";
import axios from "axios";


const PostItem = ({ post, postId, initialCommentsCount, initialLikesCount }) => {
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentsCount);
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { message: '' }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await axios.post('/api/submit-comment', { ...data, postId });
      toast.success("Comment submitted successfully!")
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response) {
        errorMessage = `Server Error: ${error.response.status}. ${error.response.data.message || ''}`;
      } else if (error.request) {
        errorMessage = "Network Error: Unable to reach the server. Please check your connection.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchComments = async (postId) => {
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

  const toggleCommentsDisplay = async () => {
    // Fetch comments only if they are not currently shown
    if (!showComments) {
      await fetchComments(postId);
    }
    setShowComments(!showComments);
  }

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
          Posted by {post.user.name} on {DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL)}
        </p>
        <div className="flex flex-col gap-2 mt-3">
          <button onClick={toggleCommentsDisplay}
           className="bg-green-600 rounded-md px-2 py-1 text-white hover:opacity-80 flex items-center"
           >
            <FiMessageSquare className="mr-2" />
            {showComments ? `Hide Comments (${commentCount})` : `Show Comments (${commentCount})`}
          </button>
          {showComments && (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                <Input 
                  id="message" 
                  label="Your Comment" 
                  register={register}
                  validation={{
                    required: "Message is required",
                    minLength: { value: 4, message: "Message must be at least 4 characters long" },
                    maxLength: { value: 280, message: "Message has 280 character limit"}
                  }}
                  errors={errors}
                  disabled={isLoading}
                />
                <Button
                  disabled={isLoading}
                  fullWidth
                  type="submit"
                >
                  Submit Comment
                </Button>
              </form>
              <CommentsSection comments={comments} />
            </>
          )}
          <LikeIcon postId={postId} initialLikesCount={initialLikesCount} userHasLiked={post.currentUserLiked} />
        </div>
      </div>
    </div>
  );
}
 
export default PostItem;