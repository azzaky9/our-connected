"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { useEffect, useState, memo } from "react";

const Pict = memo(function Pict() {
  const { user } = useAuth();
  const [profilePath, setProfilePath] = useState("");
  const folderRef = user.profilePath ? ref(storage, user.profilePath) : null;

  useEffect(() => {
    if (folderRef !== null) {
      getDownloadURL(folderRef)
        .then((data) => {
          setProfilePath(data);
        })
        .catch((err) => console.error(err));
    }
  }, [folderRef]);

  const initial = user?.email?.at(0);

  return (
    <div className='flex gap-3'>
      <Avatar>
        <AvatarImage
          src={profilePath}
          alt={`@${initial}`}
        />
        <AvatarFallback className='text-white bg-rose-600'>{initial}</AvatarFallback>
      </Avatar>
    </div>
  );
});

export default Pict;
