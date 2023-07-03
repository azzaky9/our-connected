"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

type TUserAuth = {
  email: string;
  uid: string;
};

interface TContextInitalValue {
  user: TUserAuth | null;
  clearUser: () => void;
}

const AuthContext = createContext({} as TContextInitalValue);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<TContextInitalValue["user"]>(null);

  const clear = () => setCurrentUser(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        console.log(user);
        setCurrentUser({ email: user.email, uid: user.uid });
      } else {
        clear();
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        clearUser: clear
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
