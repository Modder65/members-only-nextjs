"use client"

import React, { useState, useRef, useMemo } from 'react'
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Dialog } from '@headlessui/react'
import { DateTime } from "luxon";
import { RepliesSection } from './RepliesSection';
import { CustomLoader } from '@/components/CustomLoader';
import { useGSAP } from '@gsap/react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { closeModal } from "@/redux/features/modalSlice";
import { IoCloseSharp } from "react-icons/io5";
import CommentLikeIcon from './CommentLikeIcon';
import gsap from "gsap";
import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import axios from "axios";


function PostModal() {
  let [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const containerRef = useRef(null);
  
  const { selectedPost, isModalOpen } = useSelector(state => state.modal);

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
  

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { message: '' }
  });

  

  const onSubmit = async (data) => {
    setIsLoading(true);
    let postId = selectedPost?.id;
    try {
      await axios.post('/api/submit-comment', { ...data, postId });
      toast.success("Comment submitted successfully!");
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
            Posted by {selectedPost?.user.name} on {
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