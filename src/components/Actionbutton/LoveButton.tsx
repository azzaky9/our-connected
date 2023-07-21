'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Heart } from 'lucide-react'
import { useSource } from '@/hooks'
import { useQuery } from 'react-query'
import {
  updateDoc,
  arrayRemove,
  arrayUnion,
  doc,
  collection,
  onSnapshot,
} from 'firebase/firestore'
import { fireStore as db } from '@/firebase/config'
import { ObjectFieldTypes } from '@/types/type'
import { DocumentTypesUsers } from '@/context/AuthContext'

type LikeField = Pick<ObjectFieldTypes, 'likeBlog'>

interface TPropsLoveButton extends LikeField {
  uid: string
  blogId: string
}

const LoveButton: React.FC<TPropsLoveButton> = ({ likeBlog, uid, blogId }) => {
  const [userInField, setUserInField] = useState(false)
  const [likeCount, setLikeCount] = useState(likeBlog.length)
  const [isChecking, setIsChecking] = useState(false)

  const isUserPropNull = uid === null

  const docsRef = doc(db, 'feeds', blogId)

  const findUserExistInArray = useCallback(() => {
    setIsChecking(true)
    const finding = likeBlog.find((person) => person === uid)

    setUserInField(Boolean(finding))

    setIsChecking(false)
  }, [likeBlog, uid])

  useEffect(() => {
    findUserExistInArray()
  }, [findUserExistInArray])

  const handleLike = async () => {
    setUserInField(true)
    setLikeCount(likeCount + 1)

    await updateDoc(docsRef, {
      likeBlog: arrayUnion(uid),
    })
  }

  const handleUnlike = async () => {
    setUserInField(false)
    setLikeCount(likeCount - 1)

    await updateDoc(docsRef, {
      likeBlog: arrayRemove(uid),
    })
  }

  if (isChecking) return <span className='text-lg'>...</span>

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
          className='text-xl fill-transparent transition duration-75 cursor-pointer'
        />
      )}
      {likeCount}
    </span>
  )
}

export default LoveButton
