"use client";

import { useState } from "react";
import { useMutation } from "react-query";
import { auth, storage } from "@/firebase/config";
import { FormInput } from "@/components/form/form";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useCustomToast from "./useCustomToast";
import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User
} from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";

interface DocumentTypesUsers {
  name: string;
  username: string;
  profile_path: string;
}

const useFirebaseAuth = () => {
  const router = useRouter();
  const { clearUser, user, updateDispatchState } = useAuth();
  const { generateToast } = useCustomToast();
  const [errMessage, setErrMessage] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);

  const setCredentialUser = (email: string | null, uid: string) => {
    updateDispatchState((prevState) => ({ ...prevState, email: email, uid: uid }));
  };

  const setProfileData = (username: string, name: string, profilePath: string) => {
    updateDispatchState((prevState) => ({
      ...prevState,
      username: username,
      name: name,
      profilePath: profilePath
    }));
  };

  const directUser = async (user: User) => {
    setCredentialUser(user.email, user.uid);

    const userDocRef = doc(fireStore, "users", user.uid);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data() as DocumentTypesUsers;

      if (userData.profile_path !== "") {
        const downloadedUrl = await getDownloadURL(ref(storage, userData.profile_path));
        setProfileData(userData.username, userData.name, downloadedUrl);
      } else {
        setProfileData(userData.username, userData.name, userData.profile_path);
      }

      return router.push("/feeds");
    }

    router.push("/setup");
  };

  const mutationLogin = useMutation({
    mutationFn: async ({ email, password }: FormInput) => {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        if (user) directUser(user);

        generateToast({ message: "Redirecting", variant: "info" });
      } catch (err) {
        if (err instanceof FirebaseError) {
          setErrMessage(err.message);
        }

        setIsAuthError(true);
      }
    }
  });

  const mutationRegister = useMutation({
    mutationFn: async ({ email, password }: FormInput) => {
      return createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          router.push("/register/signin");
          generateToast({ message: "Successfully Created!, redirecting..", variant: "success" });
        })
        .catch((err) => {
          if (err instanceof FirebaseError) setErrMessage(err.message);

          setIsAuthError(true);
        });
    }
  });

  const mutationSignOut = useMutation({
    mutationFn: async () => {
      return signOut(auth)
        .then(() => {
          router.push("/register/signin");
          generateToast({ variant: "success", message: "Succes Log Out" });
          clearUser();
        })
        .catch((err) => {
          generateToast({ variant: "error", message: err.message });
        });
    }
  });

  return {
    mutationLogin,
    mutationRegister,
    mutationSignOut,
    errMessage,
    isAuthError,
    setProfileData
  };
};

export default useFirebaseAuth;
