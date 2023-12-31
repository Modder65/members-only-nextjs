import { useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { useDispatch } from "react-redux";
import { togglePostLike, toggleCommentLike, toggleReplyLike } from "@/redux/features/likesSlice";


export const PusherLikesProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Handler for post likes
    const handlePostLikeUpdate = (data) => {
      dispatch(togglePostLike({
        postId: data.postId,
        userId: data.actionUserId,
        isLiked: data.userLikedPost,
        likeCount: data.likeCount
      }));
    };

    // Handler for comment likes
    const handleCommentLikeUpdate = (data) => {
      dispatch(toggleCommentLike({
        commentId: data.commentId,
        userId: data.actionUserId,
        isLiked: data.userLikedComment,
        likeCount: data.likeCount
      }));
    };

    // Handler for reply likes
    const handleReplyLikeUpdate = (data) => {
      dispatch(toggleReplyLike({
        replyId: data.replyId,
        userId: data.actionUserId,
        isLiked: data.userLikedReply,
        likeCount: data.likeCount
      }));
    };

    pusherClient.subscribe("likes-channel");
    pusherClient.bind("post:liked", handlePostLikeUpdate);
    pusherClient.bind("comment:liked", handleCommentLikeUpdate);
    pusherClient.bind("reply:liked", handleReplyLikeUpdate);

    return () => {
      pusherClient.unsubscribe("likes-channel");
      pusherClient.unbind("post:liked", handlePostLikeUpdate);
      pusherClient.unbind("comment:liked", handleCommentLikeUpdate);
      pusherClient.unbind("reply:liked", handleReplyLikeUpdate);
    };
  }, [dispatch]);

  return <>{children}</>;
};