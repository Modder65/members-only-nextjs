'use client'

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { pusherClient } from "../../lib/pusher";
import { find } from "lodash";
import { notifyNewPost } from "@/Custom-Toast-Messages/Notify";
import { useInView } from "react-intersection-observer";
import { BeatLoader } from "react-spinners";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDispatch } from "react-redux";
import { initializeLikes } from "@/redux/features/likesSlice";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import PostList from "./components/PostList";



export default function Users() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const user = useCurrentUser();
  const dispatch = useDispatch();

  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '500px 0px'
  });
 
  useEffect(() => {
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

        // Prepare data for initializing likes
        const likesData = response.data.map(post => ({
          type: 'posts',
          itemId: post.id,
          currentUserLiked: post.currentUserLiked, 
          likeCount: post.initialLikesCount,
        }));

        // Initialize the likes in the redux store
        dispatch(initializeLikes(likesData));
  
        setHasMore(response.data.length === limit);
      } catch (error) {
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasMore]);

  const postHandler = useCallback((post) => {
    setPosts(current => {
      // If a post with this ID already exists, don't add it
      if (!find(current, { id: post.id })) {
        return [post, ...current];
      }
      return current;
    });
    notifyNewPost();
  }, []);

  useEffect(() => {
    pusherClient.subscribe("posts-channel");
    pusherClient.bind("post:created", postHandler);

    return () => {
      pusherClient.unsubscribe("posts-channel");
      pusherClient.unbind("post:created", postHandler);
    }
  }, [postHandler]);

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
      <h2 className="mb-5 text-3xl font-bold">Posts</h2>
      {user ? (
        <p className="mb-5 text-xl">Welcome <strong>{user?.name}</strong>!</p>
      ) : (
        <p>Welcome to the members only page!</p>
      )}
      <PostList posts={posts} />
      {hasMore ? (
        <div ref={ref} className="flex justify-center">
          <BeatLoader />
        </div>
      ) : (
        <p className="text-center font-semibold text-xl mt-5">There are no more posts.</p>
      )}
    </div>
  );
}