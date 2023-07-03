"use client";

import { Profile, NavigationMenu } from "@/components/Navbar/index";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const currentPath = usePathname();

  if (currentPath === "/register/signin" || currentPath === "/register/signup") {
    return null;
  }

  return (
    <nav className='sticky top-0 text-white bg-gray-400 border-b border-gray-800 bg-opacity-[0.02] filter backdrop-blur-sm px-4 py-6'>
      <div className='flex gap-5 justify-center items-center'>
        <Profile />
        <NavigationMenu />
      </div>
    </nav>
  );
};

export default Navbar;
