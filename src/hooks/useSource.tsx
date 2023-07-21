'use client'

import {
  Query,
  doc,
  getDocs,
  getDoc,
  DocumentData,
  collection,
  orderBy,
  query,
  where,
  QuerySnapshot,
} from 'firebase/firestore'
import { ObjectFieldTypes } from '@/types/type'
import { useQuery } from 'react-query'
import { fireStore as db, fireStore } from '@/firebase/config'
import { DocumentTypesUsers, useAuth } from '@/context/AuthContext'
import { FirebaseError } from 'firebase/app'

type LikeArrayTypes = { totalLike: Array<string> }

export interface TFeedsDataQuery extends Omit<ObjectFieldTypes, 'postedBy'> {
  postedBy: DocumentTypesUsers
}

const useSource = () => {
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

  const getOwnBlogs = async (uid: string) => {
    const blogRf = collection(fireStore, 'feeds')

    const q = query(blogRf, where('postedBy', '==', uid))

    const querySnapshot = await getDocs(q)

    const result = convertDates(querySnapshot)

    return result
  }

  const getlikeBlog = async (blogId: string) => {
    try {
      const likeCollection = doc(db, 'like', blogId)

      const docSnapshot = await getDoc(likeCollection)

      if (docSnapshot.exists()) return docSnapshot.data() as LikeArrayTypes
    } catch (error) {
      if (error instanceof FirebaseError) return error.message
    }
  }

  return { getMainSource, getlikeBlog, getOwnBlogs }
}

export default useSource
