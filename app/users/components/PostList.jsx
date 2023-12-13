"use client"

import PostItem from "./PostItem";
import { useEffect } from "react";
import { pusherClient } from "@/app/libs/pusher";
import { useDispatch, useSelector } from "react-redux";
import { toggleCommentLike } from "@/redux/features/likesSlice"; 

const PostList = ({ posts }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLikeUpdate = (data) => {
      // Dispatch action for real-time updates
      dispatch(toggleCommentLike({
        commentId: data.commentId,
        userId: data.actionUserId,
        isLiked: data.userLikedComment,
        likeCount: data.likeCount
      }));
    };

    pusherClient.subscribe("likes-channel");
    pusherClient.bind("comment:liked", handleLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("comment:liked", handleLikeUpdate);
    };
  }, [dispatch]);

  return (
    <>
      {posts.map(post => (
        <PostItem 
        key={post.id} 
        post={post} 
        postId={post.id} 
        initialCommentsCount={post._count.comments} 
        initialLikesCount={post._count.likes}
        currentUserLiked={post.currentUserLiked}
        />
      ))}
    </>
  );
}

export default PostList;