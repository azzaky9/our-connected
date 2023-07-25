'use client'

import React, { useEffect, useState, useMemo, memo } from 'react'

import CardCollection from '@/components/FeedsUi/CardCollection'
import DisplayEmptyPost from '@/components/DisplayEmptyPost'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'
import { useBlogs } from '@/context/BlogsContext'

const DisplayUserBlog = memo(({ userId }: { userId: string }) => {
  const { queryOption } = useBlogs()
  const [isLoading, setIsLoading] = useState(false)

  const filterBlogs = useMemo(() => {
    setIsLoading(true)

    const result = queryOption.data?.filter((d) => d.postedBy === userId)

    setIsLoading(false)

    if (result) return result
    else return null
  }, [queryOption.data, userId])

  const data = filterBlogs

  if (isLoading || queryOption.isRefetching) return <SkeletonCard />

  return (
    <React.Fragment>
      {data ? (
        <div className='px-10 pt-20 grid '>
          {data.length > 0 ? (
            <CardCollection source={filterBlogs} />
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
