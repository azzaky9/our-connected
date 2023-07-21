'use client'

import { Link as CopiedLinkIcons } from 'lucide-react'
import { usePathname } from 'next/navigation'

const CopiedLink = ({ children }: React.PropsWithChildren) => {
  const path = usePathname()

  const handleCopied = () => console.log(path, window.location.toString())

  return (
    <CopiedLinkIcons
      size={20}
      strokeWidth={1.25}
      className='hover:cursor-pointer hover:text-white text-zinc-700'
      onClick={handleCopied}
    />
  )
}

export default CopiedLink
