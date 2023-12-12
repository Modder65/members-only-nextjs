import { createContext, useContext, useReducer } from "react";

const initialState = {
  postLikes: {},
  commentLikes: {},
  replyLikes: {},
};

const likesReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_POST_LIKE':
      return { ...state, postLikes: { ...state.postLikes, [action.payload.postId]: action.payload.isLiked } };
    case 'TOGGLE_COMMENT_LIKE':
      return { ...state, commentLikes: { ...state.commentLikes, [action.payload.commentId]: action.payload.isLiked } };
    case 'TOGGLE_REPLY_LIKE':
      return { ...state, replyLikes: { ...state.replyLikes, [action.payload.replyId]: action.payload.isLiked } };
    default: 
      return state;
  }
};

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(likesReducer, initialState);
  return <LikesContext.Provider value={{ state, dispatch }}>{children}</LikesContext.Provider>
}

export const useLikes = () => useContext(LikesContext);