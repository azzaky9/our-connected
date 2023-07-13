"use client";
import SetupComponents from "@/components/SetupComponents";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// type TInputValue = { userName: string; name: string };

const Page = () => {
  const searchParams = useSearchParams();
  const validate = searchParams.get("v");
  const router = useRouter();

  useEffect(() => {
    if (!validate) router.push("/feeds");
  }, [router, validate]);

  if (!validate) {
    return (
      <div className='h-screen w-full grid place-content-center'>
        <AiOutlineLoading3Quarters className='text-2xl animate-spin text-slate-400' />
      </div>
    );
  }

  return (
    <div className='h-screen flex items-start justify-center p-10'>
      <SetupComponents />
    </div>
  );
};

export default Page;
