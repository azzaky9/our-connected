'use client'

import React from 'react'
import Card from '../FeedsUi/Card'
import { useQuery } from 'react-query'
import { doc, getDoc } from 'firebase/firestore'
import { fireStore } from '@/firebase/config'
import { ObjectFieldTypes } from '@/types/type'

const GetSpecificBlog = ({ blogId }: { blogId: string }) => {
  const getBlog = async () => {
    const documentIdRef = doc(fireStore, 'feeds', blogId)
    const blogSnapshot = await getDoc(documentIdRef)

    if (blogSnapshot.exists()) {
      const postSource = blogSnapshot.data() as ObjectFieldTypes

      return postSource
    }
  }

  const { data, isLoading } = useQuery('resultBlog', getBlog)

  if (isLoading) <p>Loading...</p>

  return (
    <div className='pt-16 lg:p-24'>
      {data ? (
        <Card dataSource={data} withButton={false} />
      ) : (
        <p>Blog Not Found</p>
      )}
    </div>
  )
}

export default GetSpecificBlog
