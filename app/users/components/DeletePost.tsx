"use client";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner";

const DeletePost = ({ postId }: { postId: string}) => {
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger>
                <FaRegTrashAlt className="w-6 h-6 text-skin-icon-accent hover:text-skin-icon-accent-hover" />
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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