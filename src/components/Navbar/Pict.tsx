"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { memo } from "react";

type TPictProps = { size?: string | number };

const Pict: React.FC<TPictProps> = memo(({ size }) => {
  const { user } = useAuth();

  const sizez = size ? `h-[${size}px] w-[${size}px]` : "";

  return (
    <div className='flex gap-3'>
      <Avatar className={sizez}>
        <AvatarImage
          src={user.profilePath}
          alt={`@z`}
        />
        <AvatarFallback className='text-white bg-rose-600'>z</AvatarFallback>
      </Avatar>
    </div>
  );
});

Pict.displayName = "Pict";

export default Pict;
