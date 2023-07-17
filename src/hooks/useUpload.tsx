"use client";

import { useAuth } from "@/context/AuthContext";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage, fireStore } from "@/firebase/config";
import {
  collection,
  doc,
  setDoc,
  where,
  query,
  getDocs,
  arrayUnion,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { useMutation } from "react-query";
import useCustomToast from "./useCustomToast";
import { FirebaseError } from "firebase/app";
import { RegisteringAssetsType } from "@/components/Navbar/FormSettingProfiles";
import { UseFormReset } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { TArgsUploadContent, TUploadIdentity } from "@/types/type";
import useFirebaseAuth from "./useFirebaseAuth";

interface ArgumentClosedHandler extends RegisteringAssetsType {
  closeEditModeHandler: () => void;
  reset: UseFormReset<RegisteringAssetsType>;
}

const useUpload = () => {
  const { user, updateDispatchState } = useAuth();
  const { generateToast } = useCustomToast();

  const checkUsernameAvailability = async (username: string) => {
    try {
      const usersCollectionRef = collection(fireStore, "users");
      const q = query(usersCollectionRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking username availability:", error);
      throw error;
    }
  };

  const updateProfile = useMutation({
    mutationFn: async ({ filePath, name, username }: TUploadIdentity) => {
      try {
        if (user.uid) {
          const userDocRef = doc(fireStore, "users", user.uid);
          const downloadedUrl = await getDownloadURL(ref(storage, filePath));

          await updateDoc(userDocRef, {
            profilePath: downloadedUrl,
            username: username,
            name: name
          });

          updateDispatchState((prevState) => ({
            ...prevState,
            name: name,
            username: username,
            profilePath: downloadedUrl
          }));
        }
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  });

  const uploadProfile = useMutation({
    mutationFn: async ({
      file,
      name,
      username,
      closeEditModeHandler,
      reset
    }: ArgumentClosedHandler) => {
      if (file) {
        try {
          const usernameExist = await checkUsernameAvailability(username);

          if (!usernameExist) throw new Error("Name already used, try another username");

          const fileName = file[0].name;
          const pathRef = `${user?.uid}/profiles/${fileName}`;
          const folderRef = ref(storage, pathRef);

          await uploadBytes(folderRef, file[0]);

          await updateProfile.mutateAsync({
            name: name,
            username: username,
            filePath: pathRef
          });

          reset();
          closeEditModeHandler();
          generateToast({ message: "Success update profile", variant: "success" });
        } catch (error) {
          if (error instanceof Error)
            generateToast({
              message: "username already used, try another username",
              variant: "error"
            });
        }
      }
    }
  });

  const uploadDefaultDocument = useMutation({
    mutationFn: async ({ name, username, filePath }: TUploadIdentity) => {
      try {
        if (user.uid) {
          console.log("trigger");

          const userDocRef = doc(fireStore, "users", user.uid);

          await setDoc(userDocRef, {
            name: name,
            username: username,
            profilePath: filePath,
            isPersonSuperUser: false
          });
        }
      } catch (error) {
        generateToast({ message: "Oops Something went wrong", variant: "error" });
      }
    }
  });

  const uploadContent = useMutation({
    mutationFn: async ({ content, title }: TArgsUploadContent) => {
      try {
        const id = uuidv4();
        const feedsCollectionRef = doc(fireStore, "feeds", id);
        const replaceNewLine = content.replace(/\n/g, "__NEWLINE__");

        const contentsField = {
          id: id,
          title: title,
          content: replaceNewLine,
          createdAt: Timestamp.now(),
          whoPosted: {
            userRef: `/users/${user.uid}`
          },
          likeCount: arrayUnion(),
          loveCount: arrayUnion()
        };

        await setDoc(feedsCollectionRef, contentsField);
      } catch (error) {
        if (error instanceof FirebaseError) throw error.message;
      }
    }
  });

  return {
    uploadProfile,
    updateProfile,
    uploadDefaultDocument,
    uploadContent,
    checkUsernameAvailability
  };
};

export { useUpload };
