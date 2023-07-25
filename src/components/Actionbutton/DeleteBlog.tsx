'use client'

import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { MoreVertical } from 'lucide-react'
import { Button } from '../ui/button'
import { fireStore } from '@/firebase/config'
import { deleteDoc, doc } from 'firebase/firestore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { FirebaseError } from 'firebase/app'
import { useMutation } from 'react-query'
import { LoaderIcon } from 'lucide-react'
import { useBlogs } from '@/context/BlogsContext'

const DeleteBlog = ({ blogId }: { blogId: string }) => {
  const { queryOption } = useBlogs()
  const [dialogOpen, setDialogOpen] = useState(false)

  const { mutate, isLoading } = useMutation({
    mutationKey: 'deleteBlog',
    mutationFn: async () => {
      try {
        const documentRef = doc(fireStore, 'feeds', blogId)
        await deleteDoc(documentRef)

        queryOption.refetch()

        setDialogOpen(false)
      } catch (error) {
        if (error instanceof FirebaseError) console.log(error.message)
      }
    },
  })

  const handleDelete = () => mutate()

  return (
    <Dialog defaultOpen={dialogOpen}>
      <Popover>
        <PopoverTrigger className='hover:cursor-pointer' asChild>
          <span className='h-fit transition duration-300 hover:bg-zinc-400 active:bg-zinc-700 rounded-full'>
            <MoreVertical size='18px' className='my-1' />
          </span>
        </PopoverTrigger>
        <PopoverContent className='w-[180px] p-0  text-slate-50 shadow-sm border-slate-800 bg-gray-900 '>
          <div className='flex flex-col text-sm'>
            <DialogTrigger asChild className='w-full'>
              <Button variant='destructive'>Delete</Button>
            </DialogTrigger>
          </div>
        </PopoverContent>
      </Popover>
      <DialogContent className='border-2 border-red-500 bg-zinc-700 bg-opacity-20 filter backdrop-blur-xl'>
        <DialogHeader>
          <DialogDescription>
            are you sure to delete this post?, confirm by clicking the button
            below or cancel this action
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <LoaderIcon /> : 'Yes i want to delete it'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteBlog
