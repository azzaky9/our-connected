"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import useCustomToast from "@/hooks/useCustomToast";

const Navbar = () => {
  const currentPath = usePathname();
  const { generateToast } = useCustomToast();

  if (currentPath === "/register/signin" || currentPath === "/register/signup") {
    return null;
  }

  return (
    <nav className='sticky top-0 text-white bg-gray-400 border-b border-gray-800 bg-opacity-[0.02] filter backdrop-blur-sm px-4 py-6'>
      <div className='flex gap-5 justify-center items-center'>
        <button onClick={() => generateToast({ variant: "info", message: "test" })}>
          test button
        </button>
        <Popover>
          <PopoverTrigger
            className='hover:cursor-pointer'
            asChild>
            <Avatar>
              <AvatarImage
                src='https://avatars.githubusercontent.com/u/105035231?v=4'
                alt='@zack'
              />
              <AvatarFallback>Z</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className='w-[180px] p-0  text-slate-50 shadow-sm border-slate-800 bg-gray-900 '>
            <div className='flex flex-col text-sm'>
              <Link
                href='/profile'
                className='hover:bg-slate-700 transition duration-300 px-4 py-3 border-b border-slate-800 rounded-sm flex justify-between'>
                Profile
                <BiUser />
              </Link>
              <Link
                href='/profile'
                className='hover:bg-slate-700 transition duration-300 px-4 py-3 rounded-sm flex  justify-between'>
                Log Out
                <IoLogOutOutline />
              </Link>
            </div>
          </PopoverContent>
        </Popover>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Post</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className='w-[180px] text-slate-50 shadow-sm border-slate-800 bg-gray-900'>
                  <div className='flex flex-col text-sm '>
                    <Link
                      href='/profile'
                      className='hover:bg-slate-700 transition duration-300 px-4 py-3 border-b border-slate-800 rounded-sm flex justify-between'>
                      Create New Post
                    </Link>
                    <Link
                      href='/profile'
                      className='hover:bg-slate-700 transition duration-300 px-4 py-3 rounded-sm flex  justify-between'>
                      Your Post
                    </Link>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;
