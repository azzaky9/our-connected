"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { memo } from "react";
import { FiUser } from "react-icons/fi";

type TPictProps = { size?: "default" | "medium" | "large" };

const Pict: React.FC<TPictProps> = memo(({ size }) => {
  const { user } = useAuth();

  const sizedMapping = {
    default: "",
    medium: "h-[52px] w-[52px]",
    large: "h-[68px] w-[68px]"
  };

  return (
    <div className='flex gap-3'>
      <Avatar className={size ? sizedMapping[size] : sizedMapping["default"]}>
        <AvatarImage
          src={user.profilePath}
          alt={`@${user.username}`}
        />
        <AvatarFallback className='text-white bg-zinc-600 text-lg'>
          <FiUser />
        </AvatarFallback>
      </Avatar>
    </div>
  );
});

Pict.displayName = "Pict";

export default Pict;
