"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import NewPost from "../form/NewPost";

const CreateNewPost = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      {children}
      <DialogContent className='bg-slate-950 border-zinc-800'>
        <DialogHeader>
          <DialogTitle className='text-white'>Create New Post</DialogTitle>
          <NewPost />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewPost;
