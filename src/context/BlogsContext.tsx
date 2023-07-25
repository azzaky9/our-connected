'use client'

import { createContext, useContext, useState } from 'react'
import { ObjectFieldTypes } from '@/types/type'
import { useQuery, UseQueryResult } from 'react-query'
import {
  query,
  collection,
  orderBy,
  getDocs,
  QuerySnapshot,
  DocumentData,
  onSnapshot,
} from 'firebase/firestore'
import { fireStore as db } from '@/firebase/config'

interface TContextValue {
  queryOption: UseQueryResult<ObjectFieldTypes[], unknown>
  isUserinsideLikeField: boolean
}

const BlogsContext = createContext({} as TContextValue)

interface TPropsBlogsProvider {
  children: React.ReactNode
}

const convertDates = (docSnapshot: QuerySnapshot<DocumentData>) => {
  const resultSource = docSnapshot.docs.map((doc) => {
    const data = doc.data()

    return {
      ...data,
      createdAt: data.createdAt.toDate().toLocaleDateString(),
    }
  }) as ObjectFieldTypes[]

  return resultSource
}

const getMainSource = async () => {
  const collectionRef = collection(db, 'feeds')
  const q = query(collectionRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)

  const result = convertDates(querySnapshot)

  return result
}

const BlogsProvider: React.FC<TPropsBlogsProvider> = ({ children }) => {
  const [isLikes, setIsLikes] = useState(false)
  // const { user } = useAuth()

  const blogsQuery = useQuery({
    queryKey: ['feeds'],
    queryFn: getMainSource,
    staleTime: Infinity,
  })

  return (
    <BlogsContext.Provider
      value={{
        queryOption: blogsQuery,
        isUserinsideLikeField: isLikes,
      }}
    >
      {children}
    </BlogsContext.Provider>
  )
}

const useBlogs = () => useContext(BlogsContext)

export { useBlogs, BlogsProvider }
