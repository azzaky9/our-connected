"use client";

import { createContext, useContext, useEffect, useState, SetStateAction, useMemo } from "react";
import { auth, fireStore, storage } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

type TUnion = string | null;

type TUserAuth = {
  profilePath: string;
  username: TUnion;
  name: TUnion;
  email: TUnion;
  uid: TUnion;
};

export type TPublicProfileInfo = Pick<TUserAuth, "username" | "name">;

interface DocumentTypesUsers {
  name: string;
  username: string;
  profile_path: string;
}

type TCredential = Omit<TUserAuth, "profilePath">;

interface TContextInitalValue {
  user: TUserAuth;
  clearUser: () => void;
  updateDispatchState: (newState: SetStateAction<TUserAuth>) => void;
}

const AuthContext = createContext({} as TContextInitalValue);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<TUserAuth>({
    email: null,
    profilePath: "",
    uid: null,
    name: null,
    username: null
  });

  const clear = () => {
    setCurrentUser({
      email: null,
      profilePath: "",
      uid: null,
      name: null,
      username: null
    });
  };

  const updateDispatchState = (newState: SetStateAction<TUserAuth>) => {
    setCurrentUser(newState);
  };

  const isObjectUserChanged = useMemo(() => {
    currentUser;
  }, [currentUser]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(fireStore, "users", user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as DocumentTypesUsers;

          const downloadedUrl = await getDownloadURL(ref(storage, userData.profile_path));
          const { email, uid } = user;
          const { name, profile_path, username } = userData;

          const updateStateValue = {
            email: email,
            uid: uid,
            username: username,
            name: name,
            profilePath: profile_path !== "" ? downloadedUrl : ""
          };

          updateDispatchState(updateStateValue);
        }
      } else {
        clear();
      }
    });
  }, [isObjectUserChanged]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        clearUser: clear,
        updateDispatchState: updateDispatchState
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
