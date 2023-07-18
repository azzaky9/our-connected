"use client";

import { useState } from "react";
import { useMutation } from "react-query";
import { auth, fireStore, provider } from "@/firebase/config";
import { type LoginValuesInput } from "@/components/form/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useCustomToast from "./useCustomToast";
import { FirebaseError } from "firebase/app";
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup
} from "firebase/auth";
import { useUpload } from "./useUpload";
import { CreateNewUserValues } from "@/components/form/CreateNewUser";
import { doc, getDoc } from "firebase/firestore";

interface DocumentTypesUsers {
  name: string;
  username: string;
  profilePath: string;
}

const useFirebaseAuth = () => {
  const router = useRouter();
  const { clearUser, user, updateDispatchState } = useAuth();
  const { generateToast } = useCustomToast();
  const [errorAuthMessage, setErrorAuthMessage] = useState<string>("");
  const [isAuthError, setIsAuthError] = useState(false);
  const { uploadDefaultDocument } = useUpload();

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

  const loginUser = useMutation({
    mutationFn: async ({ email, password }: LoginValuesInput) => {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        if (user) {
          setCredentialUser(user.email, user.uid);

          // navigateToHomePage(user);
          return router.push("/view/feeds");
        }

        generateToast({ message: "Redirecting", variant: "info" });
      } catch (err) {
        if (err instanceof FirebaseError) {
          switch (err.code) {
            case "auth/wrong-password":
              setErrorAuthMessage("incorrect password used, try again or reset password");
              break;
            case "auth/user-not-found":
              setErrorAuthMessage(
                "user not found check again the input that was written or create a new account"
              );
              break;
            default:
              setErrorAuthMessage("An error occured please check your credential again");
          }
        }

        setIsAuthError(true);
      }
    }
  });

  const createNewUser = useMutation({
    mutationFn: async ({ email, password, name, username }: CreateNewUserValues) => {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        if (user) {
          setCredentialUser(user.email, user.uid);

          await sendEmailVerification(user);

          uploadDefaultDocument
            .mutateAsync({ name: name, username: username, filePath: "" })
            .then(() => generateToast({ variant: "success", message: "Successfully Created!" }));
        }

        throw FirebaseError;
      } catch (error) {
        if (error instanceof FirebaseError) console.error(error.message);
      }
    }
  });

  const signinWithGoogleAuth = useMutation({
    mutationFn: async () => {
      try {
        const { user } = await signInWithPopup(auth, provider);

        setCredentialUser(user.email, user.uid);

        const userDocRef = doc(fireStore, "users", user.uid);
        const resultDocument = await getDoc(userDocRef);
        const data = resultDocument.data() as DocumentTypesUsers;

        if (user.displayName !== null) {
          if (resultDocument.exists()) {
            setProfileData(data.username, data.name, data.profilePath);

            router.push("/view/feeds");
          } else {
            const createRandomUser = `user${Math.floor(Math.random() * 999999)}`;

            uploadDefaultDocument.mutate({
              name: user.displayName,
              username: createRandomUser,
              filePath: ""
            });

            router.push("/view/feeds");
          }
        }
      } catch (error) {}
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
    loginUser,
    createNewUser,
    mutationSignOut,
    errorAuthMessage,
    isAuthError,
    signinWithGoogleAuth,
    setErrorAuthMessage,
    setProfileData
  };
};

export default useFirebaseAuth;
