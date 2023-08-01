'use client'

import {
  createContext,
  useContext,
  useState,
  SetStateAction,
  useEffect,
} from 'react'
import { auth, fireStore as db, storage } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { useQuery } from 'react-query'

type TUnion = string | null

interface TUserAuth {
  profilePath: string
  username: TUnion
  name: TUnion
  email: TUnion
  uid: TUnion
  isPersonSuperUser: boolean
}

export type TPublicProfileInfo = Pick<TUserAuth, 'username' | 'name'>

export interface DocumentTypesUsers {
  name: string
  username: string
  profilePath: string
  isPersonSuperUser: boolean
}

interface TContextInitalValue {
  user: TUserAuth
  clearUser: () => void
  updateDispatchState: (newState: SetStateAction<TUserAuth>) => void
}

const AuthContext = createContext({} as TContextInitalValue)

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [path, setPath] = useState('')
  const [currentUser, setCurrentUser] = useState<TUserAuth>({
    email: null,
    profilePath: '',
    uid: null,
    name: null,
    username: null,
    isPersonSuperUser: false,
  })

  const updateDispatchState = (newState: SetStateAction<TUserAuth>) => {
    setCurrentUser(newState)
  }

  const getProfile = async (userData: DocumentTypesUsers) => {
    if (userData.profilePath) {
      const downloadedUrl = await getDownloadURL(
        ref(storage, userData.profilePath)
      )

      return Boolean(downloadedUrl) ? setPath(downloadedUrl) : setPath('')
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid)
        const snapshot = await getDoc(docRef)
        const data = snapshot.data() as DocumentTypesUsers

        const defaultStateContext = {
          profilePath: '',
          name: null,
          username: null,
          isPersonSuperUser: false,
        }

        if (snapshot.exists()) {
          await getProfile(data)

          updateDispatchState({
            ...data,
            email: user.email,
            uid: user.uid,
          })
        } else {
          updateDispatchState({
            ...defaultStateContext,
            email: user.email,
            uid: user.uid,
          })
        }
      }
    })
  }, [])

  const clear = () => {
    setCurrentUser({
      email: null,
      profilePath: '',
      uid: null,
      name: null,
      username: null,
      isPersonSuperUser: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        clearUser: clear,
        updateDispatchState,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
