'use client'

import { useState } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import axios from "axios";


export const RepliesSection = ({ replies, commentId }) => {
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

  return (
    <div className="mt-2">
      <button onClick={() => setShowReplies(!showReplies)}
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