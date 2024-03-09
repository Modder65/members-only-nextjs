import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { Post } from '@prisma/client';

interface PostsState {
  posts: Post[]
  setPosts: (posts: Post[]) => void;
  appendPosts: (newPosts: Post[]) => void;
  prependPost: (newPost: Post) => void;
  addPost: (newPost: Post) => void;
  removePost: (postId: string ) => void;
  editPost: (editedPost: { id: string; title: string; message: string }) => void;
}

const usePostsStore = create<PostsState>(
  combine({ posts: [] as Post[] }, (set) => ({
    setPosts: (posts: Post[]) => set(() => ({ posts })),
    appendPosts: (newPosts: Post[]) => set((state) => ({ posts: [...state.posts, ...newPosts] })),
    prependPost: (newPost: Post) => set((state) => ({ posts: [newPost, ...state.posts] })),
    addPost: (newPost: Post) => set((state) => ({ posts: [newPost, ...state.posts] })),
    removePost: (postId: string) => set((state) => ({ posts: state.posts.filter((post) => post.id !== postId) })),
    editPost: ({ id, title, message }) => set((state) => ({
      posts: state.posts.map((post) => (post.id === id ? { ...post, title, message } : post)),
    })),
  }))
);

export default usePostsStore;