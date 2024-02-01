import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import EditPostForm from "./EditPostForm";


const EditPost = ({
  children,
  asChild,
  post
}) => {
  return ( 
    <Dialog>
      <DialogTrigger asChild={asChild}>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 w-auto bg-transparent border-none">
        <EditPostForm post={post}/>
      </DialogContent>
    </Dialog>
   );
}
 
export default EditPost;