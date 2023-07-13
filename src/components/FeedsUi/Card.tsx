"use client";

import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import {
  Card as ParentCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { ObjectFieldTypes } from "@/types/type";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc } from "firebase/firestore";
import { fireStore as db } from "@/firebase/config";
import { useMutation } from "react-query";
import { Skeleton } from "../ui/skeleton";
import { Sparkles } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { type DocumentTypesUsers } from "@/context/AuthContext";
import Link from "next/link";
import { FirebaseError } from "firebase/app";

interface BlogCardPropTypes {
  withButton: boolean;
  isLoading?: boolean;
  dataSource: ObjectFieldTypes;
}

const Card: React.FC<BlogCardPropTypes> = ({ isLoading, withButton, dataSource }) => {
  const { user } = useAuth();

  const lovedArr = dataSource.loveCount;

  const currentPath = usePathname();
  const [lovedTotal, setLovedTotal] = useState(lovedArr.length);
  const [isUserLoved, setIsUserLoved] = useState(false);
  const [profiles, setProfiles] = useState<any>(null);

  const docsRef = doc(db, "feeds", dataSource.id);

  const userDocument = dataSource.whoPosted.userRef;
  const splitted: string[] = userDocument.trim().split("/");

  const documentRef = doc(db, splitted[1], splitted[2]);

  const getUserProfile = useCallback(async () => {
    try {
      const response = await getDoc(documentRef);

      if (response.exists()) {
        const result = response.data() as DocumentTypesUsers;

        setProfiles(result);
      }

      throw FirebaseError;
    } catch (error) {
      if (error instanceof FirebaseError) console.log(error.message);
    }
  }, [profiles]); // eslint-disable-line

  useEffect(() => {
    getUserProfile();
  }, []); // eslint-disable-line

  const putNewUserOnInterestField = useMutation({
    mutationKey: "interactWithInterest",
    mutationFn: async () => {
      if (isUserLoved) {
        updateDoc(docsRef, {
          ["loveCount"]: arrayRemove(user.uid)
        }).then(() => console.log("removed"));
      } else {
        updateDoc(docsRef, {
          ["loveCount"]: arrayUnion(user.uid)
        }).then(() => console.log("created"));
      }
    }
  });

  const renderLongText = (
    <Link
      href={`/view/${dataSource.id}`}
      className='bg-gradient-to-r text-zinc-400 from-transparent from-10% via-slate-950 via-50% to-slate-950 to-60% absolute bottom-[22px] right-8 pl-7 pr-2 z-10'>
      read
    </Link>
  );

  function showReadButton() {
    const countContentLength = dataSource.content.split(" ").length;

    if (currentPath === "/view/feeds" && countContentLength > 50) {
      return renderLongText;
    }
  }

  const handleUndoInterest = () => {
    if (!putNewUserOnInterestField.isLoading) {
      setIsUserLoved(false);
      setLovedTotal(lovedTotal - 1);
      putNewUserOnInterestField.mutate();
    }
  };

  const handleIncrementInterest = () => {
    if (!putNewUserOnInterestField.isLoading) {
      setIsUserLoved(true);
      setLovedTotal(lovedTotal + 1);
      putNewUserOnInterestField.mutate();
    }
  };

  const renderOverflowClasses = currentPath === "/view/feeds" ? "h-24 overflow-hidden" : "";

  const createSuperUserStars = profiles?.isPersonSuperUser ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Sparkles
          className='cursor-pointer'
          size='14px'
          color='#eeff1d'
        />
      </TooltipTrigger>
      <TooltipContent className='bg-zinc-900 border-zinc-900 text-white'>
        This user indicating Super User
      </TooltipContent>
    </Tooltip>
  ) : null;

  useEffect(() => {
    const checkUserExist = () => {
      const finding = dataSource.loveCount.find((ids) => ids === user.uid);

      setIsUserLoved(Boolean(finding));
    };

    checkUserExist();
  }, [dataSource.loveCount, user.uid]);

  return (
    <ParentCard className='max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300'>
      <CardHeader>
        <CardTitle>
          {isLoading ? <Skeleton className='w-[120px] h-[10px] bg-zinc-700' /> : dataSource.title}
        </CardTitle>
        <CardDescription className='text-sm flex gap-2'>
          {isLoading ? (
            <Skeleton className='bg-zinc-700 w-[62px] h-[10px]' />
          ) : (
            <div className='flex items-center gap-2'>
              {createSuperUserStars} <span>{profiles?.username}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='text-sm relative'>
        {isLoading ? (
          <div className='flex flex-col gap-3'>
            {["w-[85%]", "w-3/4", "w-[80%]", "w-[50%]"].map((itemUnit) => (
              <Skeleton
                key={itemUnit}
                className={`${itemUnit} h-[10px] bg-zinc-700`}
              />
            ))}
          </div>
        ) : (
          <article className={renderOverflowClasses}>{dataSource.content}</article>
        )}
        {showReadButton()}
      </CardContent>
      <CardFooter>
        <div className='flex justify-between items-center w-full'>
          <div className='flex gap-5'>
            <span className='flex gap-2 items-center'>
              {isUserLoved ? (
                <AiFillHeart
                  onClick={handleUndoInterest}
                  className='text-xl text-rose-500 transition duration-150 scale-110 cursor-pointer'
                />
              ) : (
                <AiOutlineHeart
                  onClick={handleIncrementInterest}
                  className='text-xl text-gray-700 transition duration-75 cursor-pointer '
                />
              )}

              {lovedTotal}
            </span>
            {isLoading ? (
              <Skeleton className='bg-zinc-700 w-[72px] h-[10px]' />
            ) : (
              <span className='text-gray-500 px-4'>
                Created At: {typeof dataSource.createdAt === "string" && dataSource.createdAt}
              </span>
            )}
          </div>

          {withButton ? (
            <Link href={`/view/${dataSource.id}`}>
              <Button
                variant='default'
                className='hover:bg-rose-600 flex gap-2 justify-center'>
                Detail
              </Button>
            </Link>
          ) : null}
        </div>
      </CardFooter>
    </ParentCard>
  );
};

export default Card;
