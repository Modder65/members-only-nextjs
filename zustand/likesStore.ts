import { create } from 'zustand';

interface LikesState {
  posts: Record<string, { currentUserLiked: boolean; likeCount: number }>;
  comments: Record<string, { currentUserLiked: boolean; likeCount: number }>;
  replies: Record<string, { currentUserLiked: boolean; likeCount: number }>;
  toggleLike: (payload: { postId?: string; commentId?: string; replyId?: string; currentUserLiked?: boolean; likeCount: number }) => void;
  initializeLikes: (payload: { type: 'posts' | 'comments' | 'replies'; itemId: string; currentUserLiked: boolean; likeCount: number }[]) => void;
}

const useLikesStore = create<LikesState>((set) => ({
  posts: {},
  comments: {},
  replies: {},
  toggleLike: ({ postId, commentId, replyId, currentUserLiked, likeCount }) => set((state) => {
    let type, itemId;
    if (postId) {
      type = 'posts';
      itemId = postId;
    } else if (commentId) {
      type = 'comments';
      itemId = commentId;
    } else if (replyId) {
      type = 'replies';
      itemId = replyId;
    }

    const itemState = state[type][itemId] || { currentUserLiked: false, likeCount: 0 };
    return {
      [type]: {
        ...state[type],
        [itemId]: {
          ...itemState,
          likeCount,
          currentUserLiked: currentUserLiked !== undefined ? currentUserLiked : itemState.currentUserLiked,
        },
      },
    };
  }),
  initializeLikes: (payload) => set((state) => {
    const newState = { ...state };
    payload.forEach(({ type, itemId, currentUserLiked, likeCount }) => {
      newState[type] = newState[type] || {};
      newState[type][itemId] = { currentUserLiked, likeCount };
    });
    return newState;
  }),
}));

export default useLikesStore;
