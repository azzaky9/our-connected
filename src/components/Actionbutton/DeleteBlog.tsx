'use client'

import React from 'react'
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

const DeleteBlog = ({ blogId }: { blogId: string }) => {
  const { mutate, isLoading } = useMutation({
    mutationKey: 'deleteBlog',
    mutationFn: async () => {
      try {
        const documentRef = doc(fireStore, 'feeds', blogId)
        await deleteDoc(documentRef)
      } catch (error) {
        return error instanceof FirebaseError ? error.message : undefined
      }
    },
  })

  const handleDelete = () => mutate()

  return (
    <Dialog>
      <Popover>
        <PopoverTrigger className='hover:cursor-pointer' asChild>
          <span className='px-[2px] hover:bg-gray-500 rounded-full'>
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