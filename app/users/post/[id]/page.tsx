"use client";

import { useEffect, useState, useTransition } from 'react'
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { EditPostSchema } from "@/schemas";
import { editPost } from '@/actions/edit-post';
import { HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { getPostById } from '@/actions/getPostById';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import { Post } from '@prisma/client';
import { UploadResult } from '@/types/types';
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";

export default function EditPost({ params }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [post, setPost] = useState<Post | null>(null);
  const [imageURL, setImageURL] = useState<string>(""); // State to store the image URL

  const router = useRouter();

  let postId: string = params.id;

  useEffect(() => {
   getPostById(postId)
    .then((data) => {
      if (data?.error) {
        toast.error("Error fetching post!");
      }

      if (data) {
        setPost(data?.post);
        setImageURL(data?.post?.image);
      }
    })
    .catch(() => setError("Something went wrong!"))
  }, [postId]);

  const form = useForm<z.infer<typeof EditPostSchema>>({
    resolver: zodResolver(EditPostSchema),
    defaultValues: {
      title: post?.title || "",
      message: post?.message || "",
    },
  });

  // Update form values once the post data is loaded
  useEffect(() => {
    if (post) {
      form.reset({
        title: post?.title || "",
        message: post?.message || "",
      });
    }
  }, [post, form]);

  const onSubmit = (values: z.infer<typeof EditPostSchema>) => {
    setError("");
    setSuccess("");
    let postId = post?.id;

    startTransition(() => {
      editPost(values, postId, imageURL)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            toast.error("Error updating post!");
          }

          if (data?.success) {
            setSuccess(data.success);
            toast.success("Post updated successfully!");
            router.push("/users");
          }
        })
        .catch(() => setError("Something went wrong!"))
    });
  }

  const handleUpload = (result: UploadResult) => {
    const url = result?.info?.secure_url;
    console.log("Image url", url);
    if (url) {
      setImageURL(url); // Store the image URL instead of directly uploading
    }
  };

  const removeImage = () => {
    setImageURL("");
  }

  return ( 
    <div className="flex justify-center mt-8 max-w-3xl w-full mx-auto px-5">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <p className="text-2xl font-bold text-center">
            Edit Post
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField 
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Message</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    {imageURL && (
                      <div className="flex flex-row-reverse items-center gap-2">
                        <h3>Delete</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-pointer">
                                <FaRegTrashAlt className="h-6 w-6 text-skin-icon-accent hover:text-skin-icon-accent-hover" onClick={removeImage} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove Image</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                    <div className={`flex ${!imageURL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                      <p>Upload</p>
                      <CldUploadButton
                        options={{ 
                          sources: ['local'],
                          maxFiles: 1,
                          singleUploadAutoClose: false
                        }}
                        onUpload={handleUpload}
                        uploadPreset="jfaab9re"
                      >
                        <HiPhoto size={30} className="cursor-pointer text-skin-icon-accent hover:text-skin-icon-accent-hover" />
                      </CldUploadButton>
                    </div>
                  </div>
                  {imageURL && (
                    <Image src={imageURL} alt="Uploaded" width={500} height={500} className="rounded shadow-md" />
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-row-reverse items-center gap-2">
                  <h3>Cancel</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/users" className="cursor-pointer w-6">
                          <FaRegTimesCircle className="w-6 h-6 text-skin-icon-accent hover:text-skin-icon-accent-hover"/>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cancel</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-[100px]"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
   );
}
 