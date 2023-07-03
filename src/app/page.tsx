import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Home() {
  return (
    <div className='h-screen'>
      <div className='grid place-content-center w-full'>
        <AiOutlineLoading3Quarters className='animate-spin' />
      </div>
    </div>
  );
}
