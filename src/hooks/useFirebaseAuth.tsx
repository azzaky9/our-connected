"use client";

import { useMutation } from "react-query";
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { FormInput } from "@/components/form/form";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import useCustomToast from "./useCustomToast";
import { FirebaseError } from "firebase/app";
import { useState } from "react";

const useFirebaseAuth = () => {
  const router = useRouter();
  const { clearUser } = useAuth();
  const { generateToast } = useCustomToast();
  const [errMessage, setErrMessage] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);

  const mutationLogin = useMutation({
    mutationFn: async ({ email, password }: FormInput) => {
      return signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          router.replace("/feeds");
          generateToast({ message: "Redirecting", variant: "info" });
        })
        .catch((err) => {
          if (err instanceof FirebaseError) setErrMessage(err.message);

          setIsAuthError(true);
        });
    }
  });

  const mutationRegister = useMutation({
    mutationFn: async ({ email, password }: FormInput) => {
      return createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          router.replace("/register/signin");
          generateToast({ message: "Successfully Created!, redirecting..", variant: "success" });
        })
        .catch((err) => {
          if (err instanceof FirebaseError) setErrMessage(err.message);

          setIsAuthError(true);
        });
    }
  });

  // const registerErrorToState = (err: FirebaseError) => setErrMessage(err.message);

  const mutationSignOut = useMutation({
    mutationFn: async () => {
      return signOut(auth)
        .then(() => {
          clearUser();
          generateToast({ variant: "success", message: "Succes Log Out" });
          router.replace("/register/signin");
        })
        .catch((err) => {
          generateToast({ variant: "error", message: err.message });
        });
    }
  });

  return { mutationLogin, mutationRegister, mutationSignOut, errMessage, isAuthError };
};

export default useFirebaseAuth;
