"use client"

import { useState, useMemo, useTransition } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCommentSchema } from "@/schemas";
import { toast } from "sonner";
import { DateTime } from "luxon";
import { RepliesSection } from './RepliesSection';
import { BeatLoader } from "react-spinners";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createComment } from '@/actions/create-comment';
import { useSelector, shallowEqual } from 'react-redux';
import CommentLikeIcon from './CommentLikeIcon';
import Link from "next/link";


export const CommentForm = ({ post }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Access the comments for the specific post
  const allComments = useSelector(state => state.comments.commentsByPostId, shallowEqual);
  
  const comments = useMemo(() => {
    return allComments[post?.id] || [];
  }, [allComments, post?.id]);


  const form = useForm({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (values) => {
    setError("");
    setSuccess("");
    let postId = post?.id;

    startTransition(() => {
      createComment(values, postId)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
            toast.error("Error submitting Comment")
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            toast.success("Comment submitted successfully!");
          }
        })
        .catch(() => setError("Something went wrong!"))
    });
  }

  return (
    <Card className="w-[310px] sm:w-[400px] rounded p-0 bg-white">
      <CardHeader className="flex justify-between px-6 pb-0">
        <p className="text-xl font-bold truncate max-w-[calc(100%-2.5rem)]">{post?.title}</p>
      </CardHeader>
      <p className='text-sm text-gray-500 mb-1 px-6'>
      Posted by 
      <Link href={`/users/${post?.user.id}`} className="text-blue-600 hover:underline">
        <span className="text-blue-600 hover:underline cursor-pointer"> {post?.user.name}</span>
      </Link> on {
          DateTime.fromISO(post?.createdAt).toLocaleString({
            month: 'numeric',
            day: 'numeric',
            year: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        }
      </p>
      <CardContent>
        <div className="fade-container">
          <div className="mt-4 max-h-[400px] overflow-y-auto scrollbar-custom pb-24">
            {!comments && (
              <BeatLoader />
            )}
            {comments.map(comment => (
              <div key={comment.id} className="comment-item p-3 border-t border-gray-300">
                <p className="text-gray-800">{comment.message}</p>
                <p className="text-sm text-gray-500">
                  Posted by {comment.user.name} on {
                    DateTime.fromISO(comment.createdAt).toLocaleString({
                      month: 'numeric',
                      day: 'numeric',
                      year: '2-digit',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }
                </p>
                <CommentLikeIcon commentId={comment.id} />
                <RepliesSection commentId={comment.id} initialRepliesCount={comment._count.replies} />
              </div>
            ))}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Comment</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        disabled={isPending}
                        placeholder="New Comment"
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
                className="text-center"
              >
                Submit Comment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
