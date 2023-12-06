'use client'

import { DateTime } from "luxon";
import { RepliesSection } from "./RepliesSection";

const CommentsSection = ({ comments }) => {
  return (
    <div className="mt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="p-3 border-t border-gray-300">
            <p className="text-gray-800">{comment.message}</p>
            <p className="text-sm text-gray-500">
              Posted by {comment.user.name} on {DateTime.fromISO(comment.createdAt).toLocaleString(DateTime.DATE_FULL)}
            </p>
            <RepliesSection commentId={comment.id} />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
 
export default CommentsSection;