"use client";

import {
  NavigationMenu as Menu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const NavigationMenu = () => {
  return (
    <Menu>
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
    </Menu>
  );
};

export default NavigationMenu;
