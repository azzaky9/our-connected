"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const SkeletonCard = () => {
  const dummyCard = new Array(5).fill("");

  return (
    <React.Fragment>
      {dummyCard.map((item, index) => (
        <Card
          key={index + 1}
          className='max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300'>
          <CardHeader>
            <CardTitle>
              <Skeleton className='w-[120px] h-[10px] bg-zinc-700' />
            </CardTitle>
            <div className='text-sm flex gap-2'>
              <Skeleton className='bg-zinc-700 w-[62px] h-[10px]' />
            </div>
          </CardHeader>
          <CardContent className='text-sm relative'>
            <div className='flex flex-col gap-3'>
              <Skeleton className='w-[85%] h-[10px] bg-zinc-700' />
              <Skeleton className='w-3/4 h-[10px] bg-zinc-700' />
              <Skeleton className='w-[80%} h-[10px] bg-zinc-700' />
              <Skeleton className='w-[50%] h-[10px] bg-zinc-700' />
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex justify-between items-center w-full'>
              <Skeleton className='bg-zinc-700 w-[72px] h-[10px]' />
            </div>
          </CardFooter>
        </Card>
      ))}
    </React.Fragment>
  );
};

export default SkeletonCard;
