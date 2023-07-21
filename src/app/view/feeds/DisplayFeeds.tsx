'use client'

import { useSource } from '@/hooks'
import { useQuery } from 'react-query'
import CardCollection from '@/components/FeedsUi/CardCollection'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'

const DisplayFeeds = () => {
  const { getMainSource } = useSource()

  const { data, isLoading } = useQuery({
    queryKey: ['feeds'],
    queryFn: getMainSource,
  })

  if (isLoading) return <SkeletonCard />

  return data ? <CardCollection source={data} /> : null
}

export default DisplayFeeds
