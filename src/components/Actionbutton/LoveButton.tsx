'use client'

import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSource } from '@/hooks'
import { useQuery, useMutation } from 'react-query'
import {
  updateDoc,
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  collection,
} from 'firebase/firestore'
import { fireStore as db } from '@/firebase/config'

const LoveButton = ({
  blogId,
  uid,
}: {
  blogId: string
  uid: string | null
}) => {
  // const { user } = useAuth()
  const { getlikeBlog } = useSource()

  const [userInField, setUserInField] = useState(false)

  const isUserPropNull = uid === null

  const { mutate } = useMutation({
    mutationKey: 'interactWithInterest',
    mutationFn: async () => {
      const docsRef = doc(db, 'like', blogId)

      if (userInField) {
        await updateDoc(docsRef, {
          totalLike: arrayRemove(uid),
        }).then(() => console.log('removed'))
      } else {
        await updateDoc(docsRef, {
          totalLike: arrayUnion(`${uid}`),
        }).then(() => console.log('created'))
      }
    },
  })

  const findUserExistInArray = (s: Array<string>) => {
    const finding = s.find((id) => id === uid)
    // setIsUserLoved(Boolean(finding))

    setUserInField(Boolean(finding))
  }

  const { data, isError, isLoading, refetch } = useQuery('likeBlog', {
    queryFn: async () => {
      const likeBlog = await getlikeBlog(blogId)

      const isRetrieveValid = likeBlog && typeof likeBlog !== 'string'

      if (isRetrieveValid) findUserExistInArray(likeBlog.totalLike)

      return isRetrieveValid ? likeBlog.totalLike : null
    },
  })

  const handleLike = () => mutate()

  const handleUnlike = () => mutate()

  useEffect(() => {
    // Firestore collection reference
    const collectionRef = collection(db, 'like')

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        switch (change.type) {
          case 'added':
            return refetch()
          case 'removed':
            return refetch()
        }
      })
    })

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [refetch])

  if (isLoading) <p>Loading...</p>

  return (
    <span
      className={`${
        isUserPropNull ? 'hidden' : 'flex'
      } gap-2 items-center select-none`}
    >
      {userInField ? (
        <Heart
          color='rgb(225, 29, 72)'
          onClick={handleUnlike}
          className='text-xl fill-rose-600 transition duration-150 scale-110 cursor-pointer'
        />
      ) : (
        <Heart
          color='#3f3f46'
          onClick={handleLike}
          className={`text-xl fill-transparent transition duration-75 cursor-pointer`}
        />
      )}
      {data?.length}
    </span>
  )
}

export default LoveButton
