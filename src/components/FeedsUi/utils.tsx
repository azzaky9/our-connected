'use client'

import { ObjectFieldTypes } from '@/types/type'
import Link from 'next/link'

interface TPropShowNextReadButton extends Pick<ObjectFieldTypes, 'id'> {
  currentPath: string
  lengthContent: number
}

const ShowNextReadButton: React.FC<TPropShowNextReadButton> = ({
  currentPath,
  lengthContent,
  id,
}) => {
  const direcTo = `/view/${id}`

  if (lengthContent < 75) {
    return null
  }

  if (currentPath !== '/view/feeds') {
    return null
  }

  return (
    <Link
      href={direcTo}
      className='bg-gradient-to-r text-zinc-400 from-transparent from-10% via-slate-950 via-50% to-slate-950 to-60% absolute bottom-[22px] right-8 pl-7 pr-2 z-10'
    >
      read
    </Link>
  )
}

export { ShowNextReadButton }
