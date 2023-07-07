"use client";

import {
  NavigationMenu as Menu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import NewPost from "../form/NewPost";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const NavigationMenu = () => {
  return (
    <Dialog>
      <Menu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Post</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className='w-[180px] text-slate-50 shadow-sm border-slate-800 bg-gray-900'>
                <div className='flex flex-col text-sm '>
                  <DialogTrigger className='hover:bg-slate-700 transition duration-300 px-4 py-3 rounded-sm flex  justify-between'>
                    Create New Post <IoMdAdd />
                  </DialogTrigger>
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
      </Menu>
      <DialogContent className='bg-slate-950 border-zinc-800'>
        <DialogHeader>
          <DialogTitle className='text-white'>Create New Post</DialogTitle>
          <NewPost />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationMenu;
