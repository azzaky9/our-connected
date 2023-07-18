"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IoLogOutOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { SheetTrigger } from "../ui/sheet";
import ProfileSettings from "@/components/Navbar/ProfileSettings";
import Pict from "./Pict";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from "../ui/dialog";

const Profile = () => {
  const { mutationSignOut } = useFirebaseAuth();

  return (
    <Dialog>
      <Popover>
        <PopoverTrigger
          className='hover:cursor-pointer'
          asChild>
          <div>
            <Pict />
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-[180px] p-0  text-slate-50 shadow-sm border-slate-800 bg-gray-900 '>
          <div className='flex flex-col text-sm'>
            <ProfileSettings>
              <SheetTrigger asChild>
                <Button className='hover:bg-slate-700 ring-0 transition duration-300 px-4 py-3 border-b bg-gray-900 border-slate-800 rounded-sm flex justify-between'>
                  Profile
                  <BiUser />
                </Button>
              </SheetTrigger>
            </ProfileSettings>

            <DialogTrigger className='hover:bg-slate-700 transition duration-300 border-none outline-none px-4 py-3 rounded-sm flex bg-gray-900 justify-between'>
              Log Out
              <IoLogOutOutline />
            </DialogTrigger>
          </div>
        </PopoverContent>
      </Popover>
      <DialogContent className=' bg-slate-900 border-slate-600'>
        <DialogHeader>
          <DialogDescription className='text-white'>
            Are you sure absolutely sure for Log Out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={mutationSignOut.isLoading}
            onClick={() => mutationSignOut.mutate()}
            className=' bg-white text-black hover:bg-gray-200 '>
            {mutationSignOut.isLoading ? <Loader className='animate-spin' /> : "Confirm Sign Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
