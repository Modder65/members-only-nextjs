'use client'

import { useState } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import axios from "axios";


export const RepliesSection = ({ commentId }) => {
  const [replies, setReplies] = useState([]);
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
      toast.error("Error submitting reply");
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

  const toggleRepliesDisplay = async () => {
    // Fetch comments only if they are not currently shown
    if (!showReplies) {
      await fetchReplies(commentId);
    }
    setShowReplies(!showReplies);
  }

  return (
    <div className="mt-2">
      <button onClick={toggleRepliesDisplay}
       className="text-green-600 hover:text-green-800 text-sm"
       >
        {showReplies ? 'Hide Replies' : `Show Replies (${replies.length})`}
      </button>
      {showReplies && (
        <div className="mt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Input
              id="message" 
              label="Message" 
              register={register}
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