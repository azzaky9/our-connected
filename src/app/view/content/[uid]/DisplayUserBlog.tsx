'use client'

import React, { useMemo, memo } from 'react'

import CardCollection from '@/components/FeedsUi/CardCollection'
import DisplayEmptyPost from '@/components/DisplayEmptyPost'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'
import { useBlogs } from '@/context/BlogsContext'
import { ObjectFieldTypes } from '@/types/type'

interface TPropDisplayUserBlog {
  userId: string
  initialData: ObjectFieldTypes[]
}

const DisplayUserBlog: React.FC<TPropDisplayUserBlog> = memo(
  ({ userId, initialData }) => {
    const { userBlogsQ } = useBlogs()

    const { data, isLoading, isRefetching } = userBlogsQ

    if (isLoading || isRefetching) return <SkeletonCard />

    return (
      <React.Fragment>
        <div className='pt-20'>
          {data && data.length > 0 ? (
            <CardCollection source={data} />
          ) : initialData && initialData.length > 0 ? (
            <CardCollection source={initialData} />
          ) : (
            <DisplayEmptyPost />
          )}
        </div>
      </React.Fragment>
    )
  }
)

DisplayUserBlog.displayName = 'DisplayUserBlog'

export default DisplayUserBlog
