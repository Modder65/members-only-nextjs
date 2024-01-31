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
import { pusherClient } from "@/lib/pusher";

const DeletePost = ({ postId, posts, setPosts }) => {
  useEffect(() => {
    const handlePostDelete = (deletedPost) => {
      setPosts(posts.filter(post => post.id !== deletedPost.id));
    };

    pusherClient.subscribe("posts-channel");
    pusherClient.bind("post:deleted", handlePostDelete);

    return () => {
      pusherClient.unsubscribe("posts-channel");
      pusherClient.unbind("post:deleted", handlePostDelete);
    };
  }, [posts, setPosts]);

  const handleDeleteClick = async () => {
    // Call the API to delete the post
    await deletePost(postId);
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