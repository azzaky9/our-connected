'use client'

import React from 'react'

import CardCollection from '@/components/FeedsUi/CardCollection'
import DisplayEmptyPost from '@/components/DisplayEmptyPost'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'
import { useSource } from '@/hooks'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from 'react-query'

const DisplayUserBlog = ({ userId }: { userId: string }) => {
  const { getOwnBlogs } = useSource()

  const { data, isLoading } = useQuery({
    queryKey: ['ownBlogs', userId],
    queryFn: () => getOwnBlogs(userId),
  })

  // useEffect(() => {
  //   // Firestore collection reference
  //   const collectionRef = collection(db, 'feeds')

  //   // Subscribe to real-time updates
  //   const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
  //     snapshot.docChanges().forEach((change) => {
  //       switch (change.type) {
  //         case 'removed':
  //           return refetch()
  //       }
  //     })
  //   })

  // Clean up the listener when the component unmounts
  //   return () => unsubscribe()
  // }, [refetch])

  if (isLoading) return <SkeletonCard />

  return (
    <React.Fragment>
      {data ? (
        <div className='px-10 pt-20 grid '>
          {data && data.length > 0 ? (
            <CardCollection source={data} />
          ) : (
            <DisplayEmptyPost />
          )}
        </div>
      ) : null}
    </React.Fragment>
  )
}

export default DisplayUserBlog
