'use client'

import CardCollection from '@/components/FeedsUi/CardCollection'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'
import { useBlogs } from '@/context/BlogsContext'

const DisplayFeeds = () => {
  const { feedsQ } = useBlogs()
  const { isRefetching, isLoading, data } = feedsQ

  if (isRefetching || isLoading) return <SkeletonCard />

  return (
    <div className='pt-20'>
      {data ? <CardCollection source={data} /> : null}
    </div>
  )
}

export default DisplayFeeds
