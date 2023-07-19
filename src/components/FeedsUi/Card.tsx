'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useMutation } from 'react-query'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDoc,
} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { fireStore as db } from '@/firebase/config'
import { useAuth } from '@/context/AuthContext'

import { type ObjectFieldTypes, type TUploadIdentity } from '@/types/type'
import { type DocumentTypesUsers } from '@/context/AuthContext'

import {
  Card as ParentCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '../ui/button'
import { ShowNextReadButton, SuperUserStars } from './utils'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import DeleteBlog from '../Actionbutton/DeleteBlog'

interface BlogCardPropTypes {
  withButton: boolean
  dataSource: ObjectFieldTypes
}

interface ProfilesAttrTypes extends Omit<TUploadIdentity, 'filePath'> {
  isPersonSuperUser: boolean
  profilePath: string
}

const newLineRegExp = /__NEWLINE__/g

const Card: React.FC<BlogCardPropTypes> = ({ withButton, dataSource }) => {
  const { user } = useAuth()

  const lovedArr = dataSource.loveCount
  const contents = dataSource.content.replace(newLineRegExp, '\n')
  const isLongText = contents.split(' ').length > 75

  const docsRef = doc(db, 'feeds', dataSource.id)

  const currentPath = usePathname()
  const isRouteOnHomepage = currentPath === '/view/feeds'

  const [lovedTotal, setLovedTotal] = useState(lovedArr.length)
  const [isUserLoved, setIsUserLoved] = useState(false)
  const [profiles, setProfiles] = useState<ProfilesAttrTypes | null>(null)

  const renderOverflowClasses =
    isRouteOnHomepage && isLongText ? 'h-24 overflow-hidden' : ''

  const getUserProfile = async () => {
    try {
      const userDocument = dataSource.whoPosted.userRef
      const splitted: string[] = userDocument.trim().split('/')
      const documentRef = doc(db, splitted[1], splitted[2])
      const response = await getDoc(documentRef)

      if (response.exists()) {
        const result = response.data() as DocumentTypesUsers

        setProfiles(result)
      }

      throw FirebaseError
    } catch (error) {
      if (error instanceof FirebaseError) console.log(error.message)
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  const putNewUserOnInterestField = useMutation({
    mutationKey: 'interactWithInterest',
    mutationFn: async () => {
      if (isUserLoved) {
        updateDoc(docsRef, {
          ['loveCount']: arrayRemove(user.uid),
        }).then(() => console.log('removed'))
      } else {
        updateDoc(docsRef, {
          ['loveCount']: arrayUnion(user.uid),
        }).then(() => console.log('created'))
      }
    },
  })

  const handleUndoInterest = () => {
    if (!putNewUserOnInterestField.isLoading) {
      setIsUserLoved(false)
      setLovedTotal(lovedTotal - 1)
      putNewUserOnInterestField.mutate()
    }
  }

  const handleIncrementInterest = () => {
    if (!putNewUserOnInterestField.isLoading) {
      setIsUserLoved(true)
      setLovedTotal(lovedTotal + 1)
      putNewUserOnInterestField.mutate()
    }
  }

  useEffect(() => {
    const checkUserExist = () => {
      const finding = dataSource.loveCount.find((ids) => ids === user.uid)

      setIsUserLoved(Boolean(finding))
    }

    checkUserExist()
  }, [dataSource.loveCount, user.uid])

  const showReadButtonProp = {
    id: dataSource.id,
    currentPath: currentPath,
    lengthContent: contents.split(' ').length,
  }

  const isUserPropNull = user.uid === null

  return (
    <ParentCard className='max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300'>
      <CardHeader>
        <CardTitle
          className={`flex ${isUserPropNull ? '' : 'justify-between'}`}
        >
          {dataSource.title}
          {!isUserPropNull && !isRouteOnHomepage && (
            <DeleteBlog blogId={dataSource.id} />
          )}
        </CardTitle>
        <CardDescription className='text-sm flex gap-2'>
          <SuperUserStars isPersonSuperUser={profiles?.isPersonSuperUser} />
          <span>{profiles?.username}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='text-sm relative'>
        <article
          className={`${renderOverflowClasses} ${
            !isRouteOnHomepage && 'whitespace-pre-wrap'
          } text-base`}
        >
          {contents}
        </article>
        <ShowNextReadButton {...showReadButtonProp} />
      </CardContent>
      <CardFooter>
        <div className='flex justify-between items-center w-full'>
          <div className='flex gap-5'>
            <span
              className={`${
                isUserPropNull ? 'hidden' : 'flex'
              } gap-2 items-center select-none`}
            >
              {isUserLoved ? (
                <AiFillHeart
                  onClick={handleUndoInterest}
                  className='text-xl text-rose-500 transition duration-150 scale-110 cursor-pointer'
                />
              ) : (
                <AiOutlineHeart
                  onClick={handleIncrementInterest}
                  className='text-xl text-gray-700 transition duration-75 cursor-pointer '
                />
              )}
              {lovedTotal}
            </span>

            <span className='text-gray-500 pt-1 text-[0.828rem]'>
              Post Date{' '}
              {typeof dataSource.createdAt === 'string' && dataSource.createdAt}
            </span>
          </div>

          <Link
            href={`/view/${dataSource.id}`}
            className={withButton ? 'block' : 'hidden'}
          >
            <Button
              variant='default'
              className='hover:bg-rose-600 flex gap-2 justify-center'
            >
              Detail
            </Button>
          </Link>
        </div>
      </CardFooter>
    </ParentCard>
  )
}

export default Card
