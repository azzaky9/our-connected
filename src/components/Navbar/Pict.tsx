"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { memo } from "react";

type TPictProps = { size?: "default" | "medium" | "large" };

const Pict: React.FC<TPictProps> = memo(({ size }) => {
  const { user } = useAuth();

  const sizedMapping = {
    default: "",
    medium: "h-[48px] w-[48px]",
    large: "h-[68px] w-[68px]"
  };

  return (
    <div className='flex gap-3'>
      <Avatar className={size ? sizedMapping[size] : sizedMapping["default"]}>
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
