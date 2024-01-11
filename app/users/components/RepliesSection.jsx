'use client'

import { useState, useEffect, useCallback, useTransition } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { pusherClient } from "@/lib/pusher";
import { notifyNewReply } from "@/Custom-Toast-Messages/Notify";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateReplySchema } from "@/schemas";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createReply } from "@/actions/create-reply";
import { initializeLikes } from "@/redux/features/likesSlice";
import ReplyLikeIcon from "./ReplyLikeIcon";
import axios from "axios";



export const RepliesSection = ({ commentId, initialRepliesCount }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [replies, setReplies] = useState([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [replyCount, setReplyCount] = useState(initialRepliesCount);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(CreateReplySchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createReply(values, commentId)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            toast.success("Post submitted successfully!");
          }
        })
        .catch(() => setError("Something went wrong!"))
    });
  }

  const fetchReplies = async (commentId) => {
    // Check if replies have already been loaded or if there are no replies to load
    if (!repliesLoaded && initialRepliesCount > 0) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/replies?commentId=${commentId}`);
        setReplies(response.data);
        setRepliesLoaded(true);

        // Prepare data for initializing likes
        const likesData = response.data.map(reply => ({
          type: 'replies',
          itemId: reply.id,
          currentUserLiked: reply.currentUserLiked, 
          likeCount: reply.initialLikesCount,
        }));

        // Initialize the likes in the redux store
        dispatch(initializeLikes(likesData));
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch replies");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleRepliesDisplay = async () => {
    // Fetch replies only if they are not currently shown
    if (!showReplies) {
      await fetchReplies(commentId);
    }
    setShowReplies(!showReplies);
  }

  const replyHandler = useCallback((reply) => {
    if (reply.commentId === commentId) {
      setReplies(current => {
        // If a comment with this ID already exists in the current state, don't add it
        if (!find(current, { id: reply.id })) {
          return [reply, ...current];
        }
        return current;
      });
      setReplyCount(currentCount => currentCount + 1);
      notifyNewReply()
    }
  }, [commentId]);

  useEffect(() => {
    pusherClient.subscribe("replies-channel");
    pusherClient.bind("reply:created", replyHandler)

    return () => {
      pusherClient.unsubscribe("replies-channel");
      pusherClient.unbind("reply:created", replyHandler);
    }
  }, [replyHandler]);

  return (
    <div className="mt-3">
      <button onClick={toggleRepliesDisplay}
       className="text-emerald-600 hover:opacity-80 text-sm"
       >
        {showReplies ? `Hide Replies (${replyCount})` : `Show Replies (${replyCount})`}
      </button>
      {showReplies && (
        <div className="mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <div className="space-y-4">
                <FormField 
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Reply</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPending}
                          placeholder="New Reply"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end mb-4">
                <Button
                  disabled={isPending}
                  type="submit"
                  className="text-center mb-4"
                >
                  Submit Reply
                </Button>
              </div>
            </form>
          </Form>
          {replies.map((reply) => (
            <div key={reply.id} className="flex  justify-between items-center p-2 border-t border-gray-200 space-x-4">
              <div>
                <p className="text-gray-800">{reply.message}</p>
                <p className="text-sm text-gray-500">
                  Posted by {reply.user.name} on {
                    DateTime.fromISO(reply.createdAt).toLocaleString({
                      month: 'numeric',
                      day: 'numeric',
                      year: '2-digit',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }
                </p>
              </div>
              <div>
                <ReplyLikeIcon replyId={reply.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}