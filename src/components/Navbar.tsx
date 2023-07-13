import { NavigationMenu } from "@/components/Navbar/index";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className='sticky top-0 text-white bg-gray-400 border-b border-gray-800 bg-opacity-[0.02] filter backdrop-blur-sm px-4 py-6'>
      <div className='flex justify-between items-center'>
        <Link href='./feeds'>
          <BiArrowBack className='text-2xl hover:bg-gray-700 p-1 rounded-md' />
        </Link>
        <NavigationMenu />
      </div>
    </nav>
  );
};

export default Navbar;
