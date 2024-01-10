"use client"

import React, { useState, useRef, useTransition } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCommentSchema } from "@/schemas";
import { toast } from "sonner";
import { Dialog } from '@headlessui/react'
import { DateTime } from "luxon";
import { RepliesSection } from './RepliesSection';
import { useGSAP } from '@gsap/react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { closeModal } from "@/redux/features/postModalSlice";
import { IoCloseSharp } from "react-icons/io5";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createComment } from '@/actions/create-comment';
import CommentLikeIcon from './CommentLikeIcon';
import gsap from "gsap";
import Link from "next/link";


function PostModal() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const containerRef = useRef(null);
  
  const { selectedPost, isModalOpen } = useSelector(state => state.postModal);

  const comments = useSelector(state => 
    state.comments.commentsByPostId[selectedPost?.id] || [],
    shallowEqual //ensures that the component only rerenders if the selected slice of state has actually changed in value, not just in reference.
  );



  const dispatch = useDispatch();

  const handleClose = () => {
    // Ensure the element exists and no ongoing animation
    if (modalRef.current) {
      // Kill any ongoing animations
      gsap.killTweensOf(modalRef.current); // make sure no other animations are running on the same element that could interfere with the closing animation

      const closingTl = gsap.timeline({
        onComplete: () => dispatch(closeModal()),
      });
  
      closingTl.to(modalRef.current, {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.out',
      });
    } else {
      dispatch(closeModal());
    }
  };
  

  const form = useForm({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (values) => {
    setError("");
    setSuccess("");
    let postId = selectedPost?.id;

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

  // Modal open animation
  useGSAP(() => {
    // Create a timeline with the open animation
    if (isModalOpen) {
      const tl = gsap.timeline();

      tl.fromTo(
        modalRef.current,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isModalOpen]);

  // Comments stagger animation
  useGSAP(() => {
    if (containerRef.current && comments.length > 0) {
      gsap.from(containerRef.current.querySelectorAll('.comment-item'), {
        opacity: 0,
        y: -20,
        stagger: 0.15,
        ease: 'power1.out',
        duration: 0.5
      });
    }
  }, { dependencies: [comments]});


  return (
    
    <Dialog onClose={handleClose} open={isModalOpen} className="relative z-50 px-5">
      <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4" ref={modalRef}>
        <Dialog.Panel className="w-full max-w-lg rounded px-5 py-5 bg-white" ref={containerRef}>
          <div className="flex justify-between">
            <Dialog.Title className="text-xl font-bold">{selectedPost?.title}</Dialog.Title>
            <IoCloseSharp onClick={handleClose} size={25} className="cursor-pointer text-rose-600"/>
          </div>
          <p className='text-sm text-gray-500 pt-2.5 mb-10'>
          Posted by 
          <Link href={`/users/${selectedPost?.user.id}`} className="text-blue-600 hover:underline">
            <span className="text-blue-600 hover:underline cursor-pointer"> {selectedPost?.user.name}</span>
          </Link> on {
              DateTime.fromISO(selectedPost?.createdAt).toLocaleString({
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
            }
          </p>
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
          <div className="fade-container">
            <div className="mt-4 max-h-[400px] overflow-y-auto scrollbar-custom pb-24">
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
                  <CommentLikeIcon 
                    commentId={comment.id} 
                    initialLikesCount={comment._count.likes}
                    currentUserLiked={comment.currentUserLiked}
                  />
                  <RepliesSection commentId={comment.id} initialRepliesCount={comment._count.replies} />
                </div>
              ))}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
  
}

export default PostModal;