"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Dialog, Transition } from '@headlessui/react'
import { DateTime } from "luxon";
import { RepliesSection } from './RepliesSection';
import { CustomLoader } from '@/components/CustomLoader';
import { useGSAP } from '@gsap/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from "@/redux/features/modalSlice";
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
    state.comments.commentsByPostId[selectedPost?.id] || []
  );
  const dispatch = useDispatch();

  console.log("heres the selected post", selectedPost);

  const handleClose = () => {
    dispatch(closeModal());
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
    if (modalRef.current) {
      console.log('isOpen:', isModalOpen); // Debug: Check the value of isOpen
  
      if (isModalOpen) {
        // Open animation
        gsap.fromTo(
          modalRef.current,
          { autoAlpha: 0, scale: 0.95 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );
      } else {
        console.log('Triggering close animation'); // Debug: Check if the close animation is triggered
  
        // Close animation
        gsap.to(modalRef.current, {
          autoAlpha: 0,
          scale: 0.95,
          duration: 0.3,
          ease: 'power1.in',
        });
      }
    }
  }, [isModalOpen]);
  

  useGSAP(() => {
    if (containerRef.current && comments.length > 0) {
      gsap.from(containerRef.current.querySelectorAll('.comment-item'), {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        ease: 'power1.out',
        duration: 0.5
      });
    }
  }, [isModalOpen, comments]);


  return (
    
    <Dialog onClose={handleClose} open={isModalOpen} className="relative z-50 px-5">
      <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4" ref={modalRef}>
        <Dialog.Panel className="w-full max-w-lg rounded px-5 py-5 bg-white" ref={containerRef}>
          <Dialog.Title className="text-xl font-bold">{selectedPost?.title}</Dialog.Title>
          <p className='text-sm text-gray-500 pt-2.5 mb-10'>
            Posted by {selectedPost?.user.name} on {
              DateTime.fromISO(selectedPost?.createdAt).toLocaleString({
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
          
          <div className="fade-container">
            <div className="mt-4 max-h-[400px] overflow-y-auto scrollbar-custom pb-24">
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
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
  
}

export default PostModal;