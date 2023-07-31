'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage'
import { storage, fireStore } from '@/firebase/config'
import {
  collection,
  doc,
  setDoc,
  where,
  query,
  getDocs,
  arrayUnion,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { useMutation } from 'react-query'
import useCustomToast from './useCustomToast'
import { FirebaseError } from 'firebase/app'
import { RegisteringAssetsType } from '@/components/Navbar/FormSettingProfiles'
import { UseFormReset } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { TArgsUploadContent, TUploadIdentity } from '@/types/type'
import FileResizer from 'react-image-file-resizer'

interface ArgumentClosedHandler extends Omit<RegisteringAssetsType, 'file'> {
  closeEditModeHandler: () => void
  reset: UseFormReset<RegisteringAssetsType>
  file: File
}

const useUpload = () => {
  const { user, updateDispatchState } = useAuth()
  const { generateToast } = useCustomToast()
  const { imageFileResizer } = FileResizer

  const usernameAvailabe = async (username: string) => {
    try {
      const usersCollectionRef = collection(fireStore, 'users')
      const q = query(usersCollectionRef, where('username', '==', username))
      const querySnapshot = await getDocs(q)

      return querySnapshot.empty
    } catch (error) {
      console.error('Error checking username availability:', error)
      throw error
    }
  }

  const compressFile = (file: Blob) => {
    return new Promise((resolve, reject) => {
      imageFileResizer(
        file,
        300,
        300,
        'JPEG',
        100,
        0,
        (resized) => resolve(resized),
        'file'
      )
    })
  }

  const updateProfile = useMutation({
    mutationKey: ['updateProfiles'],
    mutationFn: async ({ filePath, name, username }: TUploadIdentity) => {
      try {
        if (user.uid) {
          const userDocRef = doc(fireStore, 'users', user.uid)
          const downloadedUrl = await getDownloadURL(ref(storage, filePath))

          await updateDoc(userDocRef, {
            profilePath: downloadedUrl,
            username: username,
            name: name,
          })

          updateDispatchState((prevState) => ({
            ...prevState,
            name: name,
            username: username,
            profilePath: downloadedUrl,
          }))
        }
      } catch (error) {
        if (error instanceof Error) console.error(error.message)
      }
    },
  })

  const uploadProfile = useMutation({
    mutationFn: async ({
      file,
      name,
      username,
      closeEditModeHandler,
      reset,
    }: ArgumentClosedHandler) => {
      if (file) {
        try {
          const usernameExist = await usernameAvailabe(username)

          if (!usernameExist)
            throw new Error('Name already used, try another username')

          const compressed = (await compressFile(file)) as File

          const pathRef = `${user?.uid}/profiles/${compressed.name}`
          const folderRef = ref(storage, pathRef)

          await uploadBytes(folderRef, compressed)

          await updateProfile.mutateAsync({
            name: name,
            username: username,
            filePath: pathRef,
          })

          reset()
          closeEditModeHandler()
          generateToast({
            message: 'Success update profile',
            variant: 'success',
          })
        } catch (error) {
          if (error instanceof Error)
            generateToast({
              message: 'username already used, try another username',
              variant: 'error',
            })
        }
      }
    },
  })

  const uploadDefaultDocument = useMutation({
    mutationFn: async ({ name, username, filePath }: TUploadIdentity) => {
      try {
        if (user.uid) {
          console.log('trigger')

          const userDocRef = doc(fireStore, 'users', user.uid)

          await setDoc(userDocRef, {
            name: name,
            username: username,
            profilePath: filePath,
            isPersonSuperUser: false,
          })
        }
      } catch (error) {
        generateToast({
          message: 'Oops Something went wrong',
          variant: 'error',
        })
      }
    },
  })

  const uploadContent = useMutation({
    mutationFn: async ({ content, title }: TArgsUploadContent) => {
      try {
        const id = uuidv4()
        const feedsCollectionRef = doc(fireStore, 'feeds', id)
        const likeCollectionRef = doc(fireStore, 'like', id)

        const replaceNewLine = content.replace(/\n/g, '__NEWLINE__')

        const contentsField = {
          id: id,
          title: title,
          content: replaceNewLine,
          createdAt: Timestamp.now(),
          postedBy: user.uid,
          likeBlog: arrayUnion(),
        }

        await setDoc(feedsCollectionRef, contentsField)

        await setDoc(likeCollectionRef, {
          totalLike: arrayUnion(),
        })
      } catch (error) {
        if (error instanceof FirebaseError) throw error.message
      }
    },
  })

  return {
    uploadProfile,
    updateProfile,
    uploadDefaultDocument,
    uploadContent,
    usernameAvailabe,
  }
}

export default useUpload
