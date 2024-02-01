"use client";

import { useEffect } from "react";
import { deletePost } from "@/actions/delete-post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IoTrashOutline } from "react-icons/io5";
import { toast } from "sonner";

const DeletePost = ({ postId }) => {
  const handleDeleteClick = () => {
    deletePost(postId)
      .then((data) => {
        if (data?.error) {
          toast.error("Error deleting post!");
        }

        if (data?.success) {
          toast.success("Deleted post successfully!");
        }
      })
      .catch(() => toast.error("Something went wrong!"))
  };

  return ( 
    <AlertDialog>
      <AlertDialogTrigger>
        <IoTrashOutline className="w-6 h-6 text-rose-600" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This post will be permanently removed from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
   );
}
 
export default DeletePost;