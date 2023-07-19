'use client'

import {
  NavigationMenu as Menu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import Profile from './Profile'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'

const NavLink = ({ to, displayText }: { to: string; displayText: string }) => {
  return (
    <Link
      href={to}
      className='text-sm hover:bg-slate-700 transition duration-300 px-4 py-3 rounded-md flex  justify-between'
    >
      {displayText}
    </Link>
  )
}

const NavigationMenu = () => {
  const { user } = useAuth()
  const currentPath = usePathname()

  const isLocationinOwnPost = currentPath.includes('/view/content')

  return (
    <Menu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <div className='flex space-x-3'>
            {!isLocationinOwnPost ? (
              <NavLink
                displayText='Your Post'
                to={`/view/content/${user.uid}`}
              />
            ) : null}
            {!isLocationinOwnPost ? (
              <NavLink displayText='Create New Post' to='/view/create' />
            ) : null}
            <Profile />
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </Menu>
  )
}

export default NavigationMenu
