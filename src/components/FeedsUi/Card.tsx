'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { type ObjectFieldTypes } from '@/types/type'
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
import { DocumentTypesUsers } from '@/context/AuthContext'
import LoveButton from '../Actionbutton/LoveButton'
import DeleteBlog from '../Actionbutton/DeleteBlog'
import { fireStore } from '@/firebase/config'
import { getDoc, doc } from 'firebase/firestore'
import CopiedLink from './CopiedLink'

interface BlogCardPropTypes {
  withButton: boolean
  dataSource: ObjectFieldTypes
}

const Card: React.FC<BlogCardPropTypes> = ({ withButton, dataSource }) => {
  const { user } = useAuth()
  const { content, createdAt, id, postedBy, title, likeBlog } = dataSource
  const [profilePosted, setProfilePosted] = useState<DocumentTypesUsers | null>(
    null
  )
  const [isContentExpand, setIsContentExpand] = useState(false)
  const currentPath = usePathname()

  const newLineRegExp = /__NEWLINE__/g
  const contents = content.replace(newLineRegExp, '\n')

  const isContentToLong = contents.split(' ').length > 75
  const isUserPropNull = user.uid === null
  const isRouteOnHomepage = currentPath === '/view/feeds'

  useEffect(() => {
    const userRf = doc(fireStore, 'users', postedBy)

    getDoc(userRf).then((response) =>
      setProfilePosted(response.data() as DocumentTypesUsers)
    )
  }, [postedBy])

  return (
    <ParentCard
      className={`max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300`}
    >
      <CardHeader>
        <CardTitle
          className={`flex ${isUserPropNull ? '' : 'justify-between'}`}
        >
          {title}
          {!isUserPropNull && !isRouteOnHomepage ? (
            <DeleteBlog blogId={dataSource.id} />
          ) : (
            <CopiedLink />
          )}
        </CardTitle>
        <CardDescription className='text-sm flex gap-2'>
          {profilePosted?.isPersonSuperUser && <SuperUserStars />}
          <span>{profilePosted?.username}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='text-sm relative'>
        <article
          className={`${
            isContentExpand
              ? 'h-fit whitespace-pre-wrap'
              : 'h-24 overflow-hidden'
          }  text-sm`}
        >
          {contents}
        </article>
        {!isContentExpand && isContentToLong ? (
          <span
            onClick={() => setIsContentExpand((prev) => !prev)}
            className='hover:cursor-row-resize bg-gradient-to-r text-zinc-400 from-transparent from-10% via-slate-950 via-50% to-slate-950 to-60% absolute bottom-[22px] right-8 pl-7 pr-2 z-10'
          >
            read
          </span>
        ) : null}
      </CardContent>
      <CardFooter>
        <div className='flex justify-between items-center w-full'>
          <div className='flex gap-5'>
            <LoveButton blogId={id} uid={user.uid ?? ''} likeBlog={likeBlog} />

            <span className='text-gray-500 pt-1 text-[0.828rem]'>
              Post Date {typeof createdAt === 'string' && createdAt}
            </span>
          </div>
        </div>
      </CardFooter>
    </ParentCard>
  )
}

export default Card
