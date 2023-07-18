"use client";

import { NavigationMenu } from "@/components/Navbar/index";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const currentPath = usePathname();
  const isRouteOnHomepage = currentPath === "/view/feeds";

  return (
    <nav className='fixed top-0 w-full text-white bg-gray-400 border-b border-gray-800 bg-opacity-[0.02] filter backdrop-blur-sm px-4 py-6'>
      <div className={isRouteOnHomepage ? "justify-end" : "justify-between" + "flex items-center"}>
        <Link
          href='/view/feeds'
          className={isRouteOnHomepage ? "hidden" : "block"}>
          <BiArrowBack className='text-2xl hover:bg-gray-700 p-1 rounded-md' />
        </Link>
        <NavigationMenu />
      </div>
    </nav>
  );
};

export default Navbar;
