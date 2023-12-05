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
      toast.error("Error submitting post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-5">
      <h1 className="text-2xl font-bold mb-5">Post a Message</h1>
      {isLoading && (
        <div className="flex justify-center items-center absolute inset-0 bg-white bg-opacity-80 z-10">
          <ClipLoader loading={isLoading} size={50} />
        </div>
      )}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Input 
          id="title" 
          label="Title" 
          register={register}
          errors={errors}
          disabled={isLoading}
        />
        <Input 
          id="message" 
          label="Message" 
          register={register}
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