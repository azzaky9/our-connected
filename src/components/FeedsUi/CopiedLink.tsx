'use client'

import { useCustomToast } from '@/hooks'
import { Link as CopiedLinkIcons } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface TPropCopiedLink extends React.PropsWithChildren {
  blogId: string
}

const CopiedLink: React.FC<TPropCopiedLink> = ({ children, blogId }) => {
  const originURl = window.location.toString()
  const convertURL = originURl.replace('/feeds', `/${blogId}`)
  const { generateToast } = useCustomToast()

  const handleCopiedLink = () => {
    navigator.clipboard
      .writeText(convertURL)
      .then(() => {
        generateToast({
          message: 'Success',
          description: 'the link has been copied to the clipboard',
          variant: 'success',
        })
      })
      .catch((err) => {
        generateToast({ message: 'Something went wrong', variant: 'error' })
      })
  }

  return (
    <CopiedLinkIcons
      size={20}
      strokeWidth={1.25}
      className='hover:cursor-pointer hover:text-white text-zinc-700'
      onClick={handleCopiedLink}
    />
  )
}

export default CopiedLink
