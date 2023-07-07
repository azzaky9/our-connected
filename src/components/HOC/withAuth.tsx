"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const withAuth = <P extends object>(Component: React.FC<P>) => {
  const ValidateAuthComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
      if (!user.email) router.push("/register/signin");
    }, [user, router]);

    if (!user.email) {
      return (
        <div className='h-screen w-full grid place-content-center'>
          <AiOutlineLoading3Quarters className='text-2xl animate-spin text-slate-400' />
        </div>
      );
    }

    return <Component {...props} />;
  };

  return ValidateAuthComponent;
};

export default withAuth;
