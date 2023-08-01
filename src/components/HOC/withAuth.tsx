'use client'

import { useAuth } from '@/context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const withAuth = <P extends object>(Component: React.FC<P>) => {
  const ValidateAuthComponent: React.FC<P> = (props) => {
    const router = useRouter()
    const path = usePathname()
    const { user } = useAuth()

    useEffect(() => {
      if (user.uid && path === '/') {
        return router.push('/view/feeds')
      } else if (path !== '/register/signup' && !user.uid) {
        return router.push('/register/signin')
      }
    }, [user, router, path])

    if (!user.uid) {
      return (
        <div className='h-screen w-full grid place-content-center'>
          <AiOutlineLoading3Quarters className='text-2xl animate-spin text-slate-400' />
        </div>
      )
    }

    return <Component {...props} />
  }

  return ValidateAuthComponent
}

export default withAuth
