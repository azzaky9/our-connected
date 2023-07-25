'use client'

import { NavigationMenu } from '@/components/Navbar/index'
import { BiArrowBack } from 'react-icons/bi'
import { Button } from './ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const Navbar = () => {
  const currentPath = usePathname()
  const { push } = useRouter()
  const isRouteOnHomepage = currentPath === '/view/feeds'
  const { user } = useAuth()

  const renderForward = !isRouteOnHomepage ? (
    <Link href='/view/feeds'>
      <BiArrowBack className='text-2xl hover:bg-gray-700 p-1 rounded-md' />
    </Link>
  ) : null

  return (
    <nav className='z-30 fixed top-0 w-full text-white bg-gray-400 border-b border-gray-800 bg-opacity-[0.02] filter backdrop-blur-sm px-4 py-6'>
      <div
        className={`${
          isRouteOnHomepage ? 'justify-end' : 'justify-between'
        } flex items-center`}
      >
        {renderForward}
        {user.uid ? (
          <NavigationMenu />
        ) : (
          <Button onClick={() => push('register/signin')}>Login</Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
