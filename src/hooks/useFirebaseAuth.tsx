"use client";

import { useMutation } from "react-query";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { FormInput } from "@/components/form/form";
import { useRouter } from "next/navigation";
import useCustomToast from "./useCustomToast";

const useFirebaseAuth = () => {
  const router = useRouter();
  const { generateToast } = useCustomToast();

  const mutationLogin = useMutation({
    mutationFn: async ({ email, password }: FormInput) => {
      return signInWithEmailAndPassword(auth, email, password)
        .then(() => router.replace("/feeds"))
        .then(() => generateToast({ message: "Redirecting...", variant: "default" }))
        .catch((err) => err);
    }
  });

  const mutationRegister = useMutation({
    mutationFn: async ({ email, password }: FormInput) => {
      return createUserWithEmailAndPassword(auth, email, password)
        .then(() => router.replace("/register/signin"))
        .then(() =>
          generateToast({ message: "Successfully Created!, redirecting..", variant: "default" })
        )
        .catch((err) => err);
    }
  });

  return { mutationLogin, mutationRegister };
};

export default useFirebaseAuth;
