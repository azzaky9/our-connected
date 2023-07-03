"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoLogOutOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { useAuth } from "@/context/AuthContext";
import { SheetTrigger } from "../ui/sheet";
import ProfileSettings from "@/components/Navbar/ProfileSettings";

const Profile = () => {
  const { mutationSignOut } = useFirebaseAuth();
  const { user } = useAuth();

  const initial = user?.email.at(0);

  return (
    <Popover>
      <PopoverTrigger
        className='hover:cursor-pointer'
        asChild>
        <Avatar>
          <AvatarImage
            src=''
            alt={`@${initial}`}
          />
          <AvatarFallback className='text-white bg-rose-600'>{initial}</AvatarFallback>
        </Avatar>
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

          <Button
            onClick={() => mutationSignOut.mutate()}
            className='hover:bg-slate-700 transition duration-300 border-none outline-none px-4 py-3 rounded-sm flex bg-gray-900 justify-between'>
            Log Out
            <IoLogOutOutline />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
