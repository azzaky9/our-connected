"use client";

import { createContext, useContext, useEffect, useState, SetStateAction, useMemo } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

type TUnion = string | null;

type TUserAuth = {
  profilePath: string;
  username: TUnion;
  name: TUnion;
  email: TUnion;
  uid: TUnion;
};

export type TPublicProfileInfo = Pick<TUserAuth, "username" | "name">;

type TCredential = Omit<TUserAuth, "profilePath">;

interface TContextInitalValue {
  user: TUserAuth;
  clearUser: () => void;
  updateDispatchState: (newState: SetStateAction<TUserAuth>) => void;
  setDataUser: (data: TCredential) => void;
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

  const setDataUser = (data: TCredential) => {
    const { email, uid, name, username } = data;

    if (name && username) {
      setCurrentUser((prevState) => ({ ...prevState, name: name, username: username }));
    } else {
      setCurrentUser((prevState) => ({ ...prevState, email: email, uid: uid }));
    }
  };

  // const setProfilePath = (path: string) =>
  //   setCurrentUser((prevState) => ({ ...prevState, profilePath: path }));

  const z = useMemo(() => {
    currentUser;
  }, [currentUser]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser((prevState) => ({ ...prevState, email: user.email, uid: user.uid }));
      } else {
        clear();
      }
    });
  }, [z]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        clearUser: clear,
        updateDispatchState: updateDispatchState,
        setDataUser: setDataUser
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
