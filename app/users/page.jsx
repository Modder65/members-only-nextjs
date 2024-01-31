'use client'

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterPostSchema } from "@/schemas";
import { toast } from "react-hot-toast";
import { pusherClient } from "../../lib/pusher";
import { find } from "lodash";
import { notifyNewPost } from "@/Custom-Toast-Messages/Notify";
import { useInView } from "react-intersection-observer";
import { BeatLoader } from "react-spinners";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDispatch } from "react-redux";
import { initializeLikes } from "@/redux/features/likesSlice";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import PostList from "./components/PostList";
import { autoCompleteUserName } from "@/actions/auto-complete-username";




export default function Users() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = useCurrentUser();
  const dispatch = useDispatch();

  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '500px 0px'
  });

  const form = useForm({
    resolver: zodResolver(FilterPostSchema),
    defaultValues: {
      sortOrder: 'desc',
      name: '',
    },
  });
 
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

  useEffect(() => {
    fetchPosts(sortOrder);
  }, [page, sortOrder, selectedUserName]);

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

  const onSubmit = (data) => {
    // Update the selectedUserName state regardless of other conditions
    setSelectedUserName(data.name);

    // Fetch new posts if sortOrder has changed or userName has changed
    if (data.sortOrder !== sortOrder || data.name !== selectedUserName) {
      setSortOrder(data.sortOrder);
      setPosts([]);
      setPage(0);
      setIsLoading(true);
    }
  };
  
  const fetchAutocompleteResults = (partialName) => {
    if (partialName.length > 2) { // to avoid too many requests
      try {
        autoCompleteUserName(partialName)
          .then((data) => {
            if (data?.error) {
              toast.error(data.error);
            }

            const names = data;
            setAutocompleteResults(names);
          })
      } catch (error) {
        console.error("Failed to fetch autocomplete results", error);
        setAutocompleteResults([]);
      }
    } else {
      setAutocompleteResults([]);
    }
  };

  const selectName = (name) => {
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
    <div className="mx-auto max-w-3xl px-5 py-5">
      <Card className="mb-5">
        <CardHeader>
          <h2 className="mb-5 text-3xl font-bold">Posts</h2>
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
                    <FormLabel>Sort Order</FormLabel>
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
                        <FormLabel>Username</FormLabel>
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
                  <Card className="mb-5">
                    {autocompleteResults.map((name, index) => (
                      <CardListItem key={index} className="autocomplete-result cursor-pointer hover:opacity-60" onClick={() => selectName(name)}>
                        {name}
                      </CardListItem>
                    ))}
                  </Card>
                <Button
                  type="submit"
                >
                  Filter Posts
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>  
      <PostList posts={posts} setPosts={setPosts}/>
      {hasMore && !isLoading ? (
        <div ref={ref} className="flex justify-center">
          <BeatLoader />
        </div>
      ) : (
        <p className="text-center font-semibold text-xl mt-5">There are no more posts.</p>
      )}
    </div>
  );
}