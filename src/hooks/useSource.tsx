'use client'

import { Query, doc, getDocs, getDoc, DocumentData } from 'firebase/firestore'
import { ObjectFieldTypes } from '@/types/type'
import { fireStore as db, fireStore } from '@/firebase/config'
import { DocumentTypesUsers } from '@/context/AuthContext'
import { FirebaseError } from 'firebase/app'

type LikeArrayTypes = { totalLike: Array<string> }

const useSource = () => {
  const getMainSource = async (queryOption: Query<DocumentData>) => {
    const querySnapshot = await getDocs(queryOption)

    const resultSource = querySnapshot.docs.map((doc) => {
      const data = doc.data()

      return {
        ...data,
        createdAt: data.createdAt.toDate().toLocaleDateString(),
      }
    }) as ObjectFieldTypes[]

    return resultSource
  }

  const getProfileFromRef = async (reference: string) => {
    try {
      const splitted: string[] = reference.trim().split('/')
      const documentRef = doc(db, splitted[1], splitted[2])
      const response = await getDoc(documentRef)

      if (response.exists()) {
        const result = response.data() as DocumentTypesUsers

        return result
      }
    } catch (error) {
      if (error instanceof FirebaseError) return error.message
    }
  }

  const getlikeBlog = async (blogId: string) => {
    try {
      const likeCollection = doc(fireStore, 'like', blogId)

      const docSnapshot = await getDoc(likeCollection)

      if (docSnapshot.exists()) return docSnapshot.data() as LikeArrayTypes
    } catch (error) {
      if (error instanceof FirebaseError) return error.message
    }
  }

  return { getProfileFromRef, getMainSource, getlikeBlog }
}

export default useSource
