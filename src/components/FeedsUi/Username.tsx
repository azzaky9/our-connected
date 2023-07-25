'use client'

import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { Zap } from 'lucide-react'
import { DocumentTypesUsers } from '@/context/AuthContext'

type TPropUsername = Pick<DocumentTypesUsers, 'isPersonSuperUser' | 'username'>

const Username: React.FC<TPropUsername> = ({ isPersonSuperUser, username }) => {
  const superUserMarking = isPersonSuperUser ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Zap
          size={20}
          className='hover:cursor-pointer text-blue-600'
          strokeWidth={1.25}
        />
      </TooltipTrigger>
      <TooltipContent className='bg-zinc-900 border-zinc-900 text-white'>
        This user indicating Super User
      </TooltipContent>
    </Tooltip>
  ) : null

  return (
    <span className='flex gap-2 items-center '>
      <span>{username}</span>
      {superUserMarking}
    </span>
  )
}

export default Username
