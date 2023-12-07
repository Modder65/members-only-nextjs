'use client'

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiMessageSquare } from "react-icons/fi";
import CommentsSection from "./CommentsSection";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { notifyNewComment } from "@/Custom-Toast-Messages/Notify";


const PostItem = ({ post, postId, initialCommentsCount }) => {
  const [comments, setComments] = useState([]);
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
      toast.error("Error submitting comment");
    } finally {
      setIsLoading(false);
    }
  }

  const fetchComments = async (postId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/comments?postId=${postId}`);
      setComments(response.data);
    } catch (error) {
      toast.error("Failed to fetch comments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    pusherClient.subscribe("comments-channel");

    const commentHandler = (comment) => {
      // Check if the comment already exists
      if (!find(comments, { id: comment.id })) {
        if (comment.postId === postId) {
          setComments(current => [comment, ...current]); // Prepend new post to the list
          notifyNewComment(post.title);
        }
      }
    };

    pusherClient.bind("comment:created", commentHandler)

    return () => {
      pusherClient.unsubscribe("comments-channel");
      pusherClient.unbind("comment:created", commentHandler);
    }
  }, [postId]);

  const toggleCommentsDisplay = async () => {
    // Fetch comments only if they are not currently shown
    if (!showComments) {
      await fetchComments(postId);
    }
    setShowComments(!showComments);
  }

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
            {showComments ? `Hide Comments (${comments.length})` : `Show Comments (${comments.length})`}
          </button>
          {showComments && (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                <Input 
                  id="message" 
                  label="Your Comment" 
                  register={register}
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
        </div>
      </div>
    </div>
  );
}
 
export default PostItem;