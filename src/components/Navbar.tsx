import { Profile, NavigationMenu } from "@/components/Navbar/index";

const Navbar = () => {
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
