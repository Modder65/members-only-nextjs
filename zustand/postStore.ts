import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { ExtendedPost } from '@/types/types';

interface PostsState {
  posts: ExtendedPost[]
  setPosts: (posts: ExtendedPost[]) => void;
  appendPosts: (newPosts: ExtendedPost[]) => void;
  prependPost: (newPost: ExtendedPost) => void;
  addPost: (newPost: ExtendedPost) => void;
  removePost: (postId: string ) => void;
  editPost: (editedPost: { id: string; title: string; message: string }) => void;
}

const usePostsStore = create<PostsState>(
  combine({ posts: [] as ExtendedPost[] }, (set) => ({
    setPosts: (posts: ExtendedPost[]) => set(() => ({ posts })),
    appendPosts: (newPosts: ExtendedPost[]) => set((state) => ({ posts: [...state.posts, ...newPosts] })),
    prependPost: (newPost: ExtendedPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
    addPost: (newPost: ExtendedPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
    removePost: (postId: string) => set((state) => ({ posts: state.posts.filter((post) => post.id !== postId) })),
    editPost: ({ id, title, message }) => set((state) => ({
      posts: state.posts.map((post) => (post.id === id ? { ...post, title, message } : post)),
    })),
  }))
);

export default usePostsStore;