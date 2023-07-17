"use client";

import { NavigationMenu } from "@/components/Navbar/index";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const currentPath = usePathname();

  return (
    <nav className='sticky top-0 text-white bg-gray-400 border-b border-gray-800 bg-opacity-[0.02] filter backdrop-blur-sm px-4 py-6'>
      <div className='flex justify-between items-center'>
        <Link href='/view/feeds'>
          <BiArrowBack
            className={`${
              currentPath === "/view/feeds/" ? "hidden" : "block"
            }text-2xl hover:bg-gray-700 p-1 rounded-md`}
          />
        </Link>
        <NavigationMenu />
      </div>
    </nav>
  );
};

export default Navbar;
