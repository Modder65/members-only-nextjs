'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { pusherClient } from "../libs/pusher";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import PostList from "./components/PostList";
import InfiniteScroll from "react-infinite-scroll-component";
import { find } from "lodash";


export default function Users() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchPosts = async () => {
    try {
      const limit = 10;
      const response = await axios.get(`/api/posts?page=${page}&limit=${limit}`);
      
      // If page is 0, replace the posts; otherwise, append them
      if (page === 0) {
        setPosts(response.data);
      } else {
        setPosts(prevPosts => [...prevPosts, ...response.data]);
      }

      setHasMore(response.data.length === limit);
    } catch (error) {
      toast.error("Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const notifyNewPost = () =>
    toast('New post available!', {
      icon: '🆕',
      duration: 4000,
      onClick: () => {
        fetchPosts(true); // Fetch new posts when toast is clicked
        toast.dismiss(); // Dismiss the toast
      },
    });

  useEffect(() => {
    pusherClient.subscribe("posts-channel");

    const postHandler = (post) => {
      // Check if the post already exists
      if (!find(posts, { id: post.id })) {
        setPosts(current => [post, ...current]); // Prepend new post to the list
        notifyNewPost();
      }
    };

    pusherClient.bind("post:created", postHandler)

    return () => {
      pusherClient.unsubscribe("posts-channel");
      pusherClient.unbind("post:created", postHandler);
    }
  }, [posts]);

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
      <InfiniteScroll
        dataLength={posts.length}
        next={() => setPage(prevPage => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>There are no more posts</b>
          </p>
        }
      >
        <PostList posts={posts} />
      </InfiniteScroll>
    </div>
  );
}