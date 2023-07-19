'use client'

import { Button } from './ui/button'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

const DisplayEmptyPost = () => {
  const { user } = useAuth()
  const isUserPropNull = user.uid === null

  return (
    <div className='h-screen w-full flex flex-col gap-5 justify-center items-center'>
      <p className='text-center text-5xl text-zinc-700 '>
        {isUserPropNull
          ? 'This user dont have any post'
          : `No one's here try to create one`}
      </p>
      {!isUserPropNull ? (
        <Link href='/view/create'>
          <Button>Create New Post</Button>
        </Link>
      ) : null}
    </div>
  )
}

export default DisplayEmptyPost
