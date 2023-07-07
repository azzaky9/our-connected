"use client";

import { createContext, useContext, useEffect, useState, SetStateAction, useMemo } from "react";
import { auth, fireStore, storage } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { usePathname } from "next/navigation";

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
  const currentPath = usePathname();
  const [path, setPath] = useState("");
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

  const getProfile = async (userData: DocumentTypesUsers) => {
    if (userData.profile_path) {
      const downloadedUrl = await getDownloadURL(ref(storage, userData.profile_path));

      return Boolean(downloadedUrl) ? setPath(downloadedUrl) : setPath("");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(fireStore, "users", user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as DocumentTypesUsers;

          await getProfile(userData);

          const { email, uid } = user;
          const { name, username } = userData;

          const updateStateValue = {
            email: email,
            uid: uid,
            username: username,
            name: name,
            profilePath: path
          };

          updateDispatchState(updateStateValue);
        }
      } else {
        clear();
      }
    });
  }, [isObjectUserChanged, path]);

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
