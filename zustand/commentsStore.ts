import { create } from 'zustand';
import { ExtendedComment } from '@/types/types';

interface CommentsState {
  commentsByPostId: Record<string, ExtendedComment[]>;
  setCommentsForPost: (postId: string, comments: ExtendedComment[]) => void;
  updateCommentForPost: (postId: string, comment: ExtendedComment) => void;
}

const useCommentsStore = create<CommentsState>((set) => ({
  commentsByPostId: {},
  setCommentsForPost: (postId, comments) => set((state) => ({
    commentsByPostId: {
      ...state.commentsByPostId,
      [postId]: comments,
    },
  })),
  updateCommentForPost: (postId, comment) => set((state) => ({
    commentsByPostId: {
      ...state.commentsByPostId,
      [postId]: state.commentsByPostId[postId] ? [...state.commentsByPostId[postId], comment] : [comment],
    },
  })),
}));

export default useCommentsStore;
