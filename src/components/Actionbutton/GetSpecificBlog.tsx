'use client'

import { fireStore } from '@/firebase/config'
import { ObjectFieldTypes } from '@/types/type'
import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useQuery } from 'react-query'
import Card from '../FeedsUi/Card'

const getSpecificBlog = async (id: string) => {
  const docRef = doc(fireStore, 'feeds', id)
  const docSnapshot = await getDoc(docRef)
  const data = [docSnapshot.data()] as ObjectFieldTypes[]

  const result = data.map((d) => {
    if (typeof d.createdAt !== 'string') {
      return {
        ...d,
        createdAt: d.createdAt.toDate().toLocaleDateString(),
      }
    }
  })

  return result[0]
}

const GetSpecificBlog = ({ blogId }: { blogId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['feeds', blogId],
    queryFn: () => getSpecificBlog(blogId),
    staleTime: 60 * 10000,
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div className='pt-16 lg:p-24'>
      {data ? (
        <Card withButton={false} dataSource={data} />
      ) : (
        <p>Blog Not Found</p>
      )}
    </div>
  )
}

export default GetSpecificBlog
