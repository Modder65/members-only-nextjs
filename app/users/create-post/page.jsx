"use client"

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { createPost } from "@/actions/create-post";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function CreatePostPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageURL, setImageURL] = useState(null); // State to store the image URL
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      message: "",
    },
  });

  const onSubmit = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createPost(values, imageURL)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            toast.success("Post submitted successfully!");
            router.push("/users");
          }
        })
        .catch(() => setError("Something went wrong!"))
    });
  }

  const handleUpload = (result) => {
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
          <p className="text-2xl font-semibold text-center">
            ✉️ Create a Post
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPending}
                          placeholder="New Post"
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
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPending}
                          placeholder="Message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    {imageURL && (
                      <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-2">
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/users" className="cursor-pointer w-6">
                        <FaRegArrowAltCircleLeft className="w-6 h-6 text-skin-icon-accent hover:text-skin-icon-accent-hover"/>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Back to Home</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-[100px]"
                >
                  Submit Post
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}