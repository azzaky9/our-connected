'use client'

import React, { useEffect, useState } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
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
import { DocumentTypesUsers } from '@/context/AuthContext'
import { fireStore } from '@/firebase/config'
import { getDoc, doc } from 'firebase/firestore'
import LoveButton from '../Actionbutton/LoveButton'
import DeleteBlog from '../Actionbutton/DeleteBlog'
import CopiedLink from './CopiedLink'
import { ChevronUp } from 'lucide-react'
import ExpandCtnt from './ExpandCtnt'
import Username from './Username'

interface BlogCardPropTypes {
  withButton: boolean
  dataSource: ObjectFieldTypes
}

type ProfileState = DocumentTypesUsers | null

const Card: React.FC<BlogCardPropTypes> = ({ withButton, dataSource }) => {
  const { user } = useAuth()
  const { content, createdAt, id, postedBy, title, likeBlog } = dataSource
  const [profilePosted, setProfilePosted] = useState<ProfileState>(null)
  const [isContentExpand, setIsContentExpand] = useState(false)
  const pathName = usePathname()

  const params = useParams()
  const specificBlog = params as { id: string }

  const isRouteInHomepage = pathName === '/view/feeds'
  const isBetwenPathMatch = specificBlog.id === id

  const renderCopiedIcons =
    isRouteInHomepage || isBetwenPathMatch ? <CopiedLink blogId={id} /> : null

  const isScreenDisplayingOwnBlog = pathName.includes('content')

  const renderDeleteOption = isScreenDisplayingOwnBlog ? (
    <DeleteBlog blogId={id} />
  ) : null

  useEffect(() => {
    const userRf = doc(fireStore, 'users', postedBy)

    getDoc(userRf).then((response) =>
      setProfilePosted(response.data() as DocumentTypesUsers)
    )
  }, [postedBy])

  const expandComponentProps = {
    text: content,
    onExpanded: isContentExpand,
    setExpandState: setIsContentExpand,
  }

  return (
    <ParentCard className='relative max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300'>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          {title}
          {renderCopiedIcons}
          {renderDeleteOption}
        </CardTitle>
        <CardDescription className='text-sm flex gap-2'>
          {profilePosted ? (
            <Username
              isPersonSuperUser={profilePosted.isPersonSuperUser}
              username={profilePosted.username}
            />
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className='text-sm relative'>
        <ExpandCtnt {...expandComponentProps} />
      </CardContent>
      <CardFooter>
        <div className='flex justify-between items-center w-full'>
          <div className='flex gap-5 items-center '>
            <LoveButton blogId={id} uid={user.uid} likeBlog={likeBlog} />

            <span className='text-gray-500 pt-1 text-[0.828rem]'>
              Post Date {typeof createdAt === 'string' && createdAt}
            </span>
          </div>
        </div>
      </CardFooter>
      {isContentExpand ? (
        <Button
          onClick={() => setIsContentExpand(false)}
          size='icon'
          className='absolute bottom-0 right-0 lg:-right-16 m-5'
        >
          <ChevronUp size={20} color='#ffffff' strokeWidth={1.25} />
        </Button>
      ) : null}
    </ParentCard>
  )
}

export default Card
