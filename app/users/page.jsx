'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import PostList from "./components/PostList";


export default function Users() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="
        fixed
        inset-0
        bg-slate-800
        bg-opacity-75
        flex
        justify-center
        items-center
        h-screen
      ">
        <ClipLoader loading={isLoading} size={50} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-5">
      <h2 className="mb-5 text-3xl font-bold">Messages</h2>
      {status === 'authenticated' && session.user ? (
        <p className="mb-5 text-xl">Welcome <strong>{session.user.name}</strong>!</p>
      ) : (
        <p>Welcome to the members only page!</p>
      )}
      <PostList posts={posts} />
    </div>
  );
}