'use client'

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterPostSchema } from "@/schemas";
import { toast } from "react-hot-toast";
import { pusherClient } from "../../lib/pusher";
import { notifyNewPost } from "@/Custom-Toast-Messages/Notify";
import { useInView } from "react-intersection-observer";
import { BeatLoader } from "react-spinners";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardListItem } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { autoCompleteUserName } from "@/actions/auto-complete-username";
import { ExtendedPost, LikesData } from "@/types/types";
import { motion } from "framer-motion";
import usePostsStore from "@/zustand/postStore";
import useLikesStore from "@/zustand/likesStore";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import PostList from "./components/PostList";
import Link from "next/link";
import * as z from "zod";



export default function Users() {
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const user = useCurrentUser();
  
  const { setPosts, appendPosts, prependPost } = usePostsStore(state => ({
    setPosts: state.setPosts,
    appendPosts: state.appendPosts,
    prependPost: state.prependPost
  }));

  const { initializeLikes } = useLikesStore(state => ({
    initializeLikes: state.initializeLikes
  }));

  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '500px 0px'
  });

  const form = useForm<z.infer<typeof FilterPostSchema>>({
    resolver: zodResolver(FilterPostSchema),
    defaultValues: {
      sortOrder: 'desc',
      name: '',
    },
  });
 
  

  useEffect(() => {
    const fetchPosts = async (sortOrder = 'desc') => {
      try {
        const limit = 10;
        let queryString = `/api/posts?page=${page}&limit=${limit}&sortOrder=${sortOrder}`;
        if (selectedUserName) {
          console.log(selectedUserName);
          queryString += `&userName=${encodeURIComponent(selectedUserName)}`;
        }
        const response = await axios.get(queryString);
        
        // If page is 0, replace the posts; otherwise, append them
        if (page === 0) {
          setPosts(response.data);
        } else {
          appendPosts(response.data);
        }
  
        // Prepare data for initializing likes
        const likesData: LikesData[] = response.data.map((post: ExtendedPost) => ({
          type: 'posts',
          itemId: post.id,
          currentUserLiked: post.currentUserLiked, 
          likeCount: post.initialLikesCount,
        }));
  
        // Initialize the likes
        initializeLikes(likesData);
  
        setHasMore(response.data.length === limit);
      } catch (error) {
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts(sortOrder);
  }, [page, sortOrder, selectedUserName, appendPosts, initializeLikes, setPosts]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasMore]);
  
  const postHandler = useCallback((post: ExtendedPost) => {
    prependPost(post);
    notifyNewPost();
  }, [prependPost]);

  const onSubmit = (values: z.infer<typeof FilterPostSchema>) => {
    // Update the selectedUserName state regardless of other conditions
    setSelectedUserName(values.name);

    // Fetch new posts if sortOrder has changed or userName has changed
    if (values.sortOrder !== sortOrder || values.name !== selectedUserName) {
      setSortOrder(values.sortOrder);
      setPosts([]);
      setPage(0);
      setIsLoading(true);
    }
  };
  
  // Assuming setAutocompleteResults is a state setter function that expects an array of strings
  const fetchAutocompleteResults = async (partialName: string) => {
    if (partialName.length > 2) { // to avoid too many requests
      autoCompleteUserName(partialName)
        .then((names) => {
          setAutocompleteResults(names);
        })
        .catch((error) => {
          console.error("Failed to fetch autocomplete results", error);
          toast.error("Failed to fetch autocomplete results");
          setAutocompleteResults([]);
        });
    } else {
      setAutocompleteResults([]);
    }
  };

  const selectName = (name: string) => {
    form.setValue('name', name); // Update the email field with the selected email
    setAutocompleteResults([]); // Optionally, clear the autocomplete results 
  };

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
    <div className="mx-auto max-w-3xl w-full px-5 mt-8">
      <Card className="mb-7">
        <CardHeader>
          <h2 className="mb-5 text-3xl font-bold">Filter Posts</h2>
          <p className="mb-5 text-xl">Welcome <strong>{user?.name}</strong>!</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField 
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Sort Order</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Newest or Oldest"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="desc">
                            Newest
                          </SelectItem>
                          <SelectItem value="asc">
                            Oldest
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Username</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder="John Doe"
                            className="w-full"
                            onChange={(e) => {
                              field.onChange(e); // existing change handler
                              fetchAutocompleteResults(e.target.value); // new autocomplete handler
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {autocompleteResults && autocompleteResults.length > 0 && (
                    <Card className="mb-5">
                    {autocompleteResults.map((name, index) => (
                      <CardListItem key={index} className="autocomplete-result cursor-pointer hover:opacity-60" onClick={() => selectName(name)}>
                        {name}
                      </CardListItem>
                    ))}
                    </Card>
                  )}
                  <div className="flex items-center justify-end w-full">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button type="submit">
                        Filter Posts
                      </Button>
                    </motion.div>
                  </div>
            </form>
          </Form>
        </CardContent>
      </Card>  
      <PostList />
      {hasMore && !isLoading ? (
        <div ref={ref} className="flex justify-center">
          <BeatLoader />
        </div>
      ) : (
        <Card>
          <CardContent className="pt-3 pb-3 pl-3 pr-3">
            <Link href="#" className="mb-7">
              <p className="text-skin-link-accent hover:text-skin-link-accent-hover hover:underline text-center font-semibold text-xl">No More Posts, Back to Top</p>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}