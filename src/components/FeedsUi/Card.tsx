"use client";

import { useState, memo, useCallback, useEffect } from "react";
import {
  Card as ParentCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { type ParamInterestTypes, useInteractPost } from "@/hooks/useInteractPost";
import { type ObjectFieldTypes } from "@/hooks/useUpload";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type StateAttributeTypes = "alreadyLove" | "alreadyLike";

export interface TInterestHandleParam {
  stateAttr: StateAttributeTypes;
  propertyType: ParamInterestTypes;
}

export interface ParamWithCondition extends TInterestHandleParam {
  stateCondition: boolean;
}

const Card = memo(
  ({ withButton, dataSource }: { withButton: boolean; dataSource: ObjectFieldTypes }) => {
    const { user } = useAuth();

    const currentPath = usePathname();
    const { incrementInterest, undoInterest } = useInteractPost(dataSource.id);

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

    const renderOverflowClasses = currentPath === "/view/feeds" ? "h-24 overflow-hidden" : "";

    return (
      <ParentCard className='max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300'>
        <CardHeader>
          <CardTitle>{dataSource.title}</CardTitle>
          <CardDescription className='text-sm'>
            {dataSource.whoPosted.username}{" "}
            <span className='text-zinc-800'>
              {typeof dataSource.createdAt === "string" && dataSource.createdAt}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className='text-sm relative'>
          <article className={renderOverflowClasses}>{dataSource.content}</article>
          {showReadButton()}
        </CardContent>
        <CardFooter>
          <div className='flex justify-between items-center w-full'>
            <div className='flex gap-5'>
              <span className='flex gap-2 items-center'>
                {dataSource.loveCount.includes(user.uid ?? "") ? (
                  <AiFillHeart
                    onClick={() => undoInterest("love")}
                    className='text-xl text-rose-500 transition duration-150 scale-110 cursor-pointer'
                  />
                ) : (
                  <AiOutlineHeart
                    onClick={() => incrementInterest("love")}
                    className='text-xl text-gray-700 transition duration-75 cursor-pointer '
                  />
                )}
                {dataSource.loveCount.length}
              </span>
              <span className='flex gap-2 items-center'>
                {dataSource.likeCount.includes(user.uid ?? "") ? (
                  <FaThumbsUp
                    onClick={() => undoInterest("like")}
                    className='text-lg text-blue-700 transition duration-150 scale-105 cursor-pointer'
                  />
                ) : (
                  <FaRegThumbsUp
                    onClick={() => incrementInterest("like")}
                    className='text-lg text-gray-700 transition duration-75 cursor-pointer '
                  />
                )}
                {dataSource.likeCount.length}
              </span>
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
  }
);

Card.displayName = "Card";

export default Card;