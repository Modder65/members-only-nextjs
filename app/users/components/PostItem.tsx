'use client'

import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { FiMessageSquare } from "react-icons/fi";
import { pusherClient } from "@/lib/pusher";
import { notifyNewComment } from "@/Custom-Toast-Messages/Notify";
import { CldImage } from "next-cloudinary";
import { CommentButton } from "./CommentButton";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaUser } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { UserRole } from "@prisma/client";
import { ExtendedComment, LikesData } from "@/types/types";
import { motion } from "framer-motion";
import useCommentsStore from "@/zustand/commentsStore";
import useLikesStore from "@/zustand/likesStore";
import Link from "next/link";
import axios from "axios";
import PostLikeIcon from "./PostLikeIcon";
import DeletePost from "./DeletePost";


const PostItem = ({ post, postId, initialCommentsCount }) => {
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentsCount);
  const [isLoading, setIsLoading] = useState(false);

  const user = useCurrentUser();

  const { setCommentsForPost, updateCommentForPost } = useCommentsStore(state => ({
    setCommentsForPost: state.setCommentsForPost,
    updateCommentForPost: state.updateCommentForPost,
  }));

  const { initializeLikes } = useLikesStore(state => ({
    initializeLikes: state.initializeLikes,
  }));

  
  const fetchComments = async (postId: string) => {
    // Check if comments have already been loaded or if there are no comments to load
    if (!commentsLoaded && initialCommentsCount > 0) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/comments?postId=${postId}`);
        setCommentsForPost(postId, response.data);
        setCommentsLoaded(true);

        // Prepare data for initializing likes
        const likesData: LikesData[] = response.data.map((comment: ExtendedComment) => ({
          type: 'comments',
          itemId: comment.id,
          currentUserLiked: comment.currentUserLiked, 
          likeCount: comment.initialLikesCount,
        }));

        initializeLikes(likesData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch comments");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openModalHandler = async (postId: string) => {
    await fetchComments(postId);
  }

  const commentHandler = useCallback((comment: ExtendedComment) => {
    if (comment.postId === postId) {
      updateCommentForPost(postId, comment);
      setCommentCount((currentCount: number) => currentCount + 1);
      notifyNewComment(post.title);
    }
  }, [updateCommentForPost, post.title, postId]);

  useEffect(() => {
    pusherClient.subscribe("comments-channel");
    pusherClient.bind("comment:created", commentHandler)

    return () => {
      pusherClient.unsubscribe("comments-channel");
      pusherClient.unbind("comment:created", commentHandler);
    }
  }, [commentHandler]);

  return (
    <div className="max-auto max-w-3xl mb-7">
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Avatar>
            <AvatarImage src={post.user.image || ""}/>
            <AvatarFallback>
              <FaUser className="text-white"/>
            </AvatarFallback>
          </Avatar>
          <h2 className=" text-xl font-bold">{post.title}</h2>
        </div>
        <p className="mb-3">{post.message}</p>
        {post.image && 
          <CldImage 
            alt="hello" 
            src={post.image} 
            width={700} 
            height={700}
            sizes="(min-width: 480px) 50vw, (min-width: 728px) 33vw, (min-width: 976px) 25vw, 100vw" 
            priority={true} // check priorty parameter documentation; caused warning in console without it related to LCP
            quality="100"
          /> 
        }
        <div className="flex justify-between items-center mt-2.5 border-t border-gray-200 pt-2.5">
          <p className="text-sm text-gray-500">
            Posted by 
            {user?.id === post?.user?.id ? ( //optional chaining fixed client-side error on users page on refresh
              <span> {post.user.name}</span>
            ) : (
              <Link href={`/users/${post.user.id}`}>
                <span className="font-bold text-skin-link-accent hover:text-skin-link-accent-hover hover:underline cursor-pointer"> {post.user.name}</span>
              </Link>
            )} on {
              DateTime.fromISO(post.createdAt).toLocaleString({
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
            }
          </p>
          <div className="flex justify-center items-center gap-x-3">
            { (user?.id === post?.user?.id) && (
              <Link href={`users/post/${post.id}`}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-pointer">
                        <FaRegEdit className="w-6 h-6 text-skin-icon-accent hover:text-skin-icon-accent-hover" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Post</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
              </Link>
            )}
            { (user?.id === post?.user?.id || user?.role === UserRole.OWNER) && (
              <DeletePost postId={post.id} />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <CommentButton post={post} asChild>
            <motion.div whileTap={{ scale: 0.9 }}>
              <button 
              onClick={() => openModalHandler(postId)}
              className="bg-skin-button-accent hover:bg-skin-button-accent-hover rounded-md px-2 py-1 text-white flex items-center"
              >
                <FiMessageSquare className="mr-2" />
                {`Show Comments (${commentCount})`}
              </button>
            </motion.div>
          </CommentButton>
          <PostLikeIcon postId={postId} />
        </div>
      </div>
    </div>   
  );
}
 
export default PostItem;


