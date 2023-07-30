'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
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
  where,
} from 'firebase/firestore'
import { fireStore as db } from '@/firebase/config'
import { useAuth } from './AuthContext'
import { ValueOf } from 'next/dist/shared/lib/constants'

type TAct = 'increment' | 'decrement'

interface TContextValue {
  likeDummyState: TLikeDummyStates[]
  feedsQ: UseQueryResult<ObjectFieldTypes[], unknown>
  userBlogsQ: UseQueryResult<ObjectFieldTypes[] | undefined, unknown>
  updateDummy: (newDummy: TLikeDummyStates[]) => void
  actWithDummy: (id: string, uid: string, actionType?: TAct) => void
}

const BlogsContext = createContext({} as TContextValue)

interface TPropsBlogsProvider {
  children: React.ReactNode
}

const collectionRef = collection(db, 'feeds')

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

export const getUserBlogs = async (idSearch: string | null) => {
  if (idSearch) {
    const q = query(collectionRef, where('postedBy', '==', idSearch))
    const snapshot = await getDocs(q)

    const result = convertDates(snapshot)

    console.log(result, idSearch)
    return result
  }
}

export interface TLikeDummyStates {
  id: string
  totalLike: number
  interestField: string[]
}

const BlogsProvider: React.FC<TPropsBlogsProvider> = ({ children }) => {
  const { user } = useAuth()
  const [likeDummyState, setLikeDummyState] = useState<TLikeDummyStates[]>([])

  const createDefault = (data: ObjectFieldTypes[]) => {
    const defaultState: TLikeDummyStates[] = data?.map((feed) => {
      const finalState = {
        totalLike: feed.likeBlog.length,
        id: feed.id,
        interestField: feed.likeBlog,
      }

      return finalState
    })

    setLikeDummyState(defaultState)
  }

  const getMainSource = async () => {
    const q = query(collectionRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const result = convertDates(querySnapshot)

    createDefault(result)

    return result
  }

  const feedsQ = useQuery({
    queryKey: ['feeds'],
    queryFn: getMainSource,
    staleTime: Infinity,
  })

  const userBlogsQ = useQuery({
    queryKey: ['userBlogs'],
    queryFn: () => getUserBlogs(user.uid),
    staleTime: 5000,
  })

  const updateDummy = (newDummy: TLikeDummyStates[]) => {
    setLikeDummyState([...newDummy])

    console.log(likeDummyState)
  }

  const actWithDummy = (id: string, uid: string, actionType?: TAct) => {
    const updatedDummy = likeDummyState.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          totalLike:
            actionType === 'increment' ? obj.totalLike + 1 : obj.totalLike - 1,
          interestField:
            actionType === 'increment'
              ? [...obj.interestField, uid]
              : obj.interestField.filter((d) => d !== uid),
        }
      }

      return obj
    })

    updateDummy(updatedDummy)
  }

  const value: TContextValue = {
    feedsQ,
    userBlogsQ,
    updateDummy,
    actWithDummy,
    likeDummyState,
  }

  return <BlogsContext.Provider value={value}>{children}</BlogsContext.Provider>
}

const useBlogs = () => useContext(BlogsContext)

export { useBlogs, BlogsProvider }
