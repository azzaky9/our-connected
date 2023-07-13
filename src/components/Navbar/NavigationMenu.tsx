"use client";

import {
  NavigationMenu as Menu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Profile from "./Profile";

const NavLink = ({ to, displayText }: { to: string; displayText: string }) => {
  return (
    <Link
      href={to}
      className='text-sm hover:bg-slate-700 transition duration-300 px-4 py-3 rounded-md flex  justify-between'>
      {displayText}
    </Link>
  );
};

const NavigationMenu = () => {
  return (
    <Menu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <div className='flex space-x-3'>
            <NavLink
              displayText='Your Post'
              to='/view/ownpost'
            />
            <NavLink
              displayText='Create New Post'
              to='/view/create'
            />
            <Profile />
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </Menu>
  );
};

export default NavigationMenu;
