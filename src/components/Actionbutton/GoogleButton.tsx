'use client'

import { forwardRef } from 'react'
import { useFirebaseAuth } from '@/hooks'
import { Button } from '../ui/button'
import { BsGoogle } from 'react-icons/bs'

const GoogleButton = () => {
  const { signinWithGoogleAuth } = useFirebaseAuth()

  return (
    <div className='grid'>
      <Button
        disabled={signinWithGoogleAuth.isLoading}
        variant='outline'
        onClick={() => signinWithGoogleAuth.mutate()}
      >
        <BsGoogle className='mr-2 h-4 w-4' />
        Google
      </Button>
    </div>
  )
}

export default GoogleButton
