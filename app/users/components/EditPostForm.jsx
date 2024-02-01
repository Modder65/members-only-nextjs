import { useState, useTransition } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditPostSchema } from "@/schemas";
import { editPost } from '@/actions/edit-post';
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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";


const EditPostForm = ({ post }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(EditPostSchema),
    defaultValues: {
      title: post.title,
      message: post.message,
    },
  });

  const onSubmit = (values) => {
    setError("");
    setSuccess("");
    let postId = post?.id;

    startTransition(() => {
      editPost(values, postId)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            toast.error("Error updating post!");
          }

          if (data?.success) {
            setSuccess(data.success);
            toast.success("Post updated successfully!");
          }
        })
        .catch(() => setError("Something went wrong!"))
    });
  }

  return ( 
    <Card className="w-[500px] rounded px-5 py-5 bg-white">
      <CardHeader className="flex justify-between p-0">
        <p className="text-xl font-bold">Edit Post</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col">
              <div className="mb-3">
                <FormError message={error}/>
                <FormSuccess message={success}/>
              </div>
              <Button
                disabled={isPending}
                type="submit"
                className="text-center"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
   );
}
 
export default EditPostForm;