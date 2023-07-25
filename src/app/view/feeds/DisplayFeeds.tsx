'use client'

import { useSource } from '@/hooks'
import { useQuery } from 'react-query'
import CardCollection from '@/components/FeedsUi/CardCollection'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'
import { useBlogs } from '@/context/BlogsContext'

const DisplayFeeds = () => {
  const { queryOption } = useBlogs()

  if (queryOption.isLoading) return <SkeletonCard />

  return queryOption.data ? <CardCollection source={queryOption.data} /> : null
}

export default DisplayFeeds
