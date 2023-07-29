'use client'

import CardCollection from '@/components/FeedsUi/CardCollection'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'
import { useBlogs } from '@/context/BlogsContext'

const DisplayFeeds = () => {
  const { queryOption } = useBlogs()
  const { isRefetching, isLoading } = queryOption

  if (isRefetching || isLoading) return <SkeletonCard />

  return (
    <div className='pt-20'>
      {queryOption.data ? <CardCollection source={queryOption.data} /> : null}
    </div>
  )
}

export default DisplayFeeds
