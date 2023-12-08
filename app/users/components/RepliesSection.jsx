'use client'

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { notifyNewReply } from "@/Custom-Toast-Messages/Notify";


export const RepliesSection = ({ commentId, initialRepliesCount }) => {
  const [replies, setReplies] = useState([]);
  const [replyCount, setReplyCount] = useState(initialRepliesCount);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { message: '' }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post('/api/submit-reply', { ...data, commentId });
      toast.success("Reply submitted successfully!");
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
  };

  const fetchReplies = async (commentId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/replies?commentId=${commentId}`);
      setReplies(response.data);
    } catch (error) {
      toast.error("Failed to fetch replies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    pusherClient.subscribe("replies-channel");

    const replyHandler = (reply) => {
      // Check if the reply already exists
      if (!find(replies, { id: reply.id })) {
        if (reply.commentId === commentId) {
          setReplies(current => [reply, ...current]); // Prepend new post to the list
          setReplyCount(currentCount => currentCount + 1); // Increment comment count
          notifyNewReply();
        }
      }
    };

    pusherClient.bind("reply:created", replyHandler)

    return () => {
      pusherClient.unsubscribe("replies-channel");
      pusherClient.unbind("reply:created", replyHandler);
    }
  }, [commentId]);

  const toggleRepliesDisplay = async () => {
    // Fetch comments only if they are not currently shown
    if (!showReplies) {
      await fetchReplies(commentId);
    }
    setShowReplies(!showReplies);
  }

  return (
    <div className="mt-3">
      <button onClick={toggleRepliesDisplay}
       className="text-green-600 hover:text-green-800 text-sm"
       >
        {showReplies ? `Hide Replies (${replyCount})` : `Show Replies (${replyCount})`}
      </button>
      {showReplies && (
        <div className="mt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <Input
              id="message" 
              label="Your Reply" 
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
              Submit Reply
            </Button>
          </form>
          {replies.map((reply) => (
            <div key={reply.id} className="p-2 border-t border-gray-200">
              <p className="text-gray-800">{reply.message}</p>
              <p className="text-sm text-gray-500">
              Posted by {reply.user.name} on {DateTime.fromISO(reply.createdAt).toLocaleString(DateTime.DATE_FULL)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}