'use client'

import { useState, useEffect, useCallback, useTransition } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
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
import { Reply } from "@prisma/client";
import { ExtendedReply, LikesData, ReplyWithUser } from "@/types/types";
import useLikesStore from "@/zustand/likesStore";
import ReplyLikeIcon from "./ReplyLikeIcon";
import axios from "axios";
import * as z from "zod";

export const RepliesSection = ({ commentId, initialRepliesCount }) => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesLoaded, setRepliesLoaded] = useState<boolean>(false);
  const [replyCount, setReplyCount] = useState<number>(initialRepliesCount);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { initializeLikes } = useLikesStore((state) => ({
    initializeLikes: state.initializeLikes 
  }));

  const form = useForm<z.infer<typeof CreateReplySchema>>({
    resolver: zodResolver(CreateReplySchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateReplySchema>) => {
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

  const fetchReplies = async (commentId: string) => {
    // Check if replies have already been loaded or if there are no replies to load
    if (!repliesLoaded && initialRepliesCount > 0) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/replies?commentId=${commentId}`);
        setReplies(response.data);
        setRepliesLoaded(true);

        // Prepare data for initializing likes
        const likesData: LikesData[] = response.data.map((reply: ExtendedReply) => ({
          type: 'replies',
          itemId: reply.id,
          currentUserLiked: reply.currentUserLiked, 
          likeCount: reply.initialLikesCount,
        }));

        initializeLikes(likesData);
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

  const replyHandler = useCallback((reply: Reply) => {
    if (reply.commentId === commentId) {
      setReplies(currentReplies => [...currentReplies, reply]);
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
       className="text-skin-fill hover:opacity-80 text-sm"
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
          {replies.map((reply: ReplyWithUser) => (
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