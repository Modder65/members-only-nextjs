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
} from "@/components/ui/form"

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { createPost } from "@/actions/create-post";
import ClipLoader from "react-spinners/ClipLoader";


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

  // Needs to be edited to work
  const handleUpload = (result) => {
    const url = result?.info?.secure_url;
    if (url) {
      setImageURL(url); // Store the image URL instead of directly uploading
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="max-w-6xl w-full">
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
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p>Upload an Image:</p>
                  <CldUploadButton
                    options={{ 
                      sources: ['local'],
                      maxFiles: 1,
                      singleUploadAutoClose: false
                    }}
                    onUpload={handleUpload}
                    uploadPreset="jfaab9re"
                  >
                    <HiPhoto size={30} className="text-blue-600" />
                  </CldUploadButton>
                </div>
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