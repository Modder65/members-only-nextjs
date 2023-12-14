"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Dialog, Transition } from '@headlessui/react'
import { DateTime } from "luxon";
import { RepliesSection } from './RepliesSection';
import { CustomLoader } from '@/components/CustomLoader';
import CommentLikeIcon from './CommentLikeIcon';
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import axios from "axios";


function PostModal({ post, postId, onClose, comments, setComments, isOpen }) {
  let [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const containerRef = useRef(null);
 
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

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={React.Fragment}
    >
      <Dialog open={isOpen} onClose={() => onClose()} className="relative z-50 px-5">
        <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

        <div ref={modalRef} className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded px-5 py-5 bg-white" ref={containerRef}>
            <Dialog.Title className="text-xl font-bold">{post.title}</Dialog.Title>
            <p className='text-sm text-gray-500 pt-2.5 mb-10'>
              Posted by {post.user.name} on {
                DateTime.fromISO(post.createdAt).toLocaleString({
                  ...DateTime.DATE_FULL,
                  ...DateTime.TIME_SIMPLE
                })
              }
            </p>

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
              <Button disabled={isLoading} fullWidth type="submit">
                Submit Comment
              </Button>
            </form>

            <div className="mt-4 max-h-[400px] overflow-y-auto">
              {comments.map(comment => (
                <div key={comment.id} className="comment-item p-3 border-t border-gray-300">
                  <p className="text-gray-800">{comment.message}</p>
                  <p className="text-sm text-gray-500">
                    Posted by {comment.user.name} on {
                      DateTime.fromISO(comment.createdAt).toLocaleString({
                        ...DateTime.DATE_FULL,
                        ...DateTime.TIME_SIMPLE
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
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
  
}

export default PostModal;