"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import axios from "axios";

export default function CreatePostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      message: '',
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      await axios.post('/api/submit-post', data);
      toast.success("Post submitted successfully!");
      router.push("/");
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response) {
        errorMessage = `Server Error: ${error.response.status}. ${error.response.data.message || ''}`;
      } else if (error.request) {
        errorMessage = "Network Error: Unable to reach the server. Please check your connection.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-5">Post a Message</h1>
      {isLoading && (
        <div className="flex justify-center items-center absolute inset-0 bg-white bg-opacity-80 z-10">
          <ClipLoader loading={isLoading} size={50} />
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input 
          id="title" 
          label="Title" 
          register={register}
          validation={{
            required: "Title is required",
            minLength: { value: 4, message: "Title must be at least 4 characters long" },
            maxLength: { value: 50, message: "Title has 50 character limit"}
          }}
          errors={errors}
          disabled={isLoading}
        />
        <Input 
          id="message" 
          label="Message" 
          register={register}
          validation={{
            required: "Message is required",
            minLength: { value: 4, message: "Message must be at least 4 characters long" },
            maxLength: { value: 280, message: "Message has 280 character limit"}
          }}
          errors={errors}
          disabled={isLoading}
        />
        <Button
          disabled={isLoading}
          fullWidth
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}