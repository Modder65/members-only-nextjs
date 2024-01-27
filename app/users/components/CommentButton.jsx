"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { CommentForm } from "./CommentForm";

export const CommentButton = ({
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
        <CommentForm post={post}/>
      </DialogContent>
    </Dialog>
  );
};
