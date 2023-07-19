'use client'

import React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

import { type ObjectFieldTypes, type TUploadIdentity } from '@/types/type'

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
import { useSource } from '@/hooks'
import { useQuery } from 'react-query'
import { DocumentTypesUsers } from '@/context/AuthContext'
import LoveButton from '../Actionbutton/LoveButton'
import DeleteBlog from '../Actionbutton/DeleteBlog'

interface BlogCardPropTypes {
  withButton: boolean
  dataSource: ObjectFieldTypes
}

interface ProfilesAttrTypes extends Omit<TUploadIdentity, 'filePath'> {
  isPersonSuperUser: boolean
  profilePath: string
}

const Card: React.FC<BlogCardPropTypes> = ({ withButton, dataSource }) => {
  const { user } = useAuth()
  const { getProfileFromRef } = useSource()
  const { content, createdAt, id, postedBy, title } = dataSource
  const currentPath = usePathname()

  const newLineRegExp = /__NEWLINE__/g
  const contents = content.replace(newLineRegExp, '\n')

  const isLongText = contents.split(' ').length > 75
  const isUserPropNull = user.uid === null
  const isRouteOnHomepage = currentPath === '/view/feeds'

  const renderOverflowClasses =
    isRouteOnHomepage && isLongText ? 'h-24 overflow-hidden' : ''

  const showReadButtonProp = {
    id: dataSource.id,
    currentPath: currentPath,
    lengthContent: contents.split(' ').length,
  }

  const { data, isError, isLoading } = useQuery('profileFromRef', () =>
    getProfileFromRef(postedBy.userRef)
  )

  const isDataValid = !isError && typeof data !== 'string'

  return (
    <ParentCard className='max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300'>
      <CardHeader>
        <CardTitle
          className={`flex ${isUserPropNull ? '' : 'justify-between'}`}
        >
          {title}
          {!isUserPropNull && !isRouteOnHomepage ? (
            <DeleteBlog blogId={dataSource.id} />
          ) : null}
        </CardTitle>
        <CardDescription className='text-sm flex gap-2'>
          <SuperUserStars
            isPersonSuperUser={isDataValid && data?.isPersonSuperUser}
          />
          <span>{isDataValid ? data?.username : null}</span>
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
            <LoveButton blogId={id} uid={user.uid} />

            <span className='text-gray-500 pt-1 text-[0.828rem]'>
              Post Date {typeof createdAt === 'string' && createdAt}
            </span>
          </div>

          <Link
            href={`/view/${id}`}
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
