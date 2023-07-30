'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Heart } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  updateDoc,
  arrayRemove,
  arrayUnion,
  doc,
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore'
import { fireStore as db } from '@/firebase/config'
import { ObjectFieldTypes } from '@/types/type'
import { usePathname, useRouter } from 'next/navigation'
import { useBlogs } from '@/context/BlogsContext'
import { Button } from '../ui/button'

type TUid = { uid: string }

type LikeField = Pick<ObjectFieldTypes, 'likeBlog' | 'id' | 'postedBy'>

interface TPropsLoveButton extends LikeField {
  uid: string
}

const NotifiedForLogin = () => {
  const { push } = useRouter()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Heart
          color='#3f3f46'
          className='text-xl fill-transparent transition duration-75 cursor-pointer'
        />
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-slate-950 border-slate-700'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-white'>
            Not authorize for access this app
          </AlertDialogTitle>
          <AlertDialogDescription>
            Plase login with your own account, we provide some login access for
            Authenticate
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='bg-white hover:bg-white/60'>
            Stay Without Login
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => push('/register/signin')}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const LoveButton: React.FC<TPropsLoveButton> = (prop) => {
  const { likeBlog, uid, id, postedBy } = prop

  const { updateDummy, actWithDummy, likeDummyState } = useBlogs()
  const [isMountToServer, setIsMountToServer] = useState(false)

  const docsRef = doc(db, 'feeds', id)

  const getSpecState = likeDummyState.find((obj) => obj.id === id)
  const isUserInsideField = Boolean(
    getSpecState?.interestField.find((f) => f === uid)
  )

  const handleLike = async () => {
    setIsMountToServer(true)

    if (isUserInsideField) {
      actWithDummy(id, uid, 'decrement')

      await updateDoc(docsRef, {
        likeBlog: arrayRemove(uid),
      }).then(() => setIsMountToServer(false))
    } else {
      actWithDummy(id, uid, 'increment')

      await updateDoc(docsRef, {
        likeBlog: arrayUnion(uid),
      }).then(() => setIsMountToServer(false))
    }
  }

  if (uid === null) {
    return (
      <span className='flex gap-2 items-center select-none'>
        <NotifiedForLogin />
      </span>
    )
  }

  return (
    <span className='flex gap-1 items-center select-none'>
      <Button
        size='icon'
        disabled={isMountToServer}
        className={`bg-transparent hover:bg-transparent${
          isMountToServer ? 'hover:cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <Heart
          color={isUserInsideField ? 'rgb(225, 29, 72)' : '#3f3f46'}
          onClick={handleLike}
          className={`text-xl ${
            isUserInsideField ? 'fill-rose-600' : ''
          }  transition-transform duration-1000 active:scale-90 `}
        />
      </Button>
      {getSpecState?.totalLike}
    </span>
  )
}

export default LoveButton
