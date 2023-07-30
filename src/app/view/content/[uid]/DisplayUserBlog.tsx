'use client'

import React, { useState, useMemo, memo, useEffect } from 'react'

import CardCollection from '@/components/FeedsUi/CardCollection'
import DisplayEmptyPost from '@/components/DisplayEmptyPost'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'
import { useBlogs } from '@/context/BlogsContext'
import { ObjectFieldTypes } from '@/types/type'

const DisplayUserBlog = memo(({ userId }: { userId: string }) => {
  const { userBlogsQ } = useBlogs()
  const { isLoading, isRefetching, data, refetch } = userBlogsQ

  if (isLoading || isRefetching) return <SkeletonCard />

  return (
    <React.Fragment>
      {data ? (
        <div className='pt-20'>
          {data.length > 0 ? (
            <CardCollection source={data} />
          ) : (
            <DisplayEmptyPost />
          )}
        </div>
      ) : null}
    </React.Fragment>
  )
})

DisplayUserBlog.displayName = 'DisplayUserBlog'

export default DisplayUserBlog
