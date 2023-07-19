'use client'

import React from 'react'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { collection, onSnapshot } from 'firebase/firestore'
import { fireStore as db } from '@/firebase/config'
import { getDocs } from 'firebase/firestore'
import { ObjectFieldTypes } from '@/types/type'
import CardCollection from '@/components/FeedsUi/CardCollection'
import DisplayEmptyPost from '@/components/DisplayEmptyPost'
import SkeletonCard from '@/components/FeedsUi/SkeletonCard'

const DisplayBlog = ({ id }: { id: string }) => {
  const getOwnBlog = async () => {
    const q = collection(db, 'feeds')
    const docSnapshot = await getDocs(q)

    const resultSource = docSnapshot.docs.map((doc) => {
      const data = doc.data()

      return {
        ...data,
        createdAt: data.createdAt.toDate().toLocaleDateString(),
      }
    }) as ObjectFieldTypes[]

    const finalResult = resultSource.filter(
      (doc) => doc.postedBy.userRef === `/users/${id}`
    )

    return finalResult
  }

  const { isLoading, refetch, data, isSuccess } = useQuery(
    'ownBlog',
    getOwnBlog
  )

  const isPostGreaterThanZero = isSuccess && data.length > 0

  useEffect(() => {
    // Firestore collection reference
    const collectionRef = collection(db, 'feeds')

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        switch (change.type) {
          case 'removed':
            return refetch()
        }
      })
    })

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [refetch])

  if (isLoading) return <SkeletonCard direction='horizontal' />

  return (
    <div
      className={
        isPostGreaterThanZero ? 'px-10 pt-20 gap-2 grid lg:grid-cols-3' : ''
      }
    >
      {isPostGreaterThanZero && data ? (
        <CardCollection source={data} />
      ) : (
        <DisplayEmptyPost />
      )}
    </div>
  )
}

export default DisplayBlog
