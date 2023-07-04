"use client";

import { createContext, useContext, useEffect, useState, SetStateAction } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";

type TUserAuth = {
  profilePath: string | null;
  email: string | null;
  uid: string | null;
};

interface TContextInitalValue {
  user: TUserAuth;
  clearUser: () => void;
  setProfilePath: (path: string) => void;
}

const AuthContext = createContext({} as TContextInitalValue);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<TUserAuth>({
    email: null,
    profilePath: null,
    uid: null
  });

  const clear = () =>
    setCurrentUser({
      email: null,
      profilePath: null,
      uid: null
    });

  const setProfilePath = (path: string) =>
    setCurrentUser((prevState) => ({ ...prevState, profilePath: path }));

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // const profileRef = ref(storage, `profiles/${}`)
      if (user?.email) {
        setCurrentUser((prevState) => ({ ...prevState, email: user.email, uid: user.uid }));
      } else {
        clear();
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        clearUser: clear,
        setProfilePath: setProfilePath
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
