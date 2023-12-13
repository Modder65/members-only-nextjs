'use client'

import { DateTime } from "luxon";
import { RepliesSection } from "./RepliesSection";
import CommentLikeIcon from "./CommentLikeIcon";

const CommentsSection = ({ comments }) => {
  return (
    <div className="mt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="p-3 border-t border-gray-300">
            <div className="flex justify-between items-center"> {/* Center items vertically */}
              <div className="flex-1"> {/* Ensure this div takes up the remaining space */}
                <p className="text-gray-800">{comment.message}</p>
                <p className="text-sm text-gray-500">
                  Posted by {comment.user.name} on {
                    DateTime.fromISO(comment.createdAt).toLocaleString({
                      ...DateTime.DATE_FULL,
                      ...DateTime.TIME_SIMPLE
                    })
                  }
                </p>
              </div>
              <CommentLikeIcon 
                commentId={comment.id} 
                initialLikesCount={comment._count.likes}
                currentUserLiked={comment.currentUserLiked} 
              />
            </div>
            <RepliesSection commentId={comment.id} initialRepliesCount={comment._count.replies} />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
 
export default CommentsSection;