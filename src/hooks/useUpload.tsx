"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage, fireStore } from "@/firebase/config";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { useMutation } from "react-query";
import useCustomToast from "./useCustomToast";
import { FirebaseError } from "firebase/app";

type TArgsProfileUpload = {
  name: string;
  username: string;
  file: FileList;
};

const useUpload = () => {
  const { user, setProfilePath } = useAuth();
  const { generateToast } = useCustomToast();

  const uploadProfile = useMutation({
    mutationFn: async ({ name, username, file }: TArgsProfileUpload) => {
      const fileName = file[0].name;
      const pathRef = `${user?.uid}/profiles/${fileName}`;

      // reference folder for keeping content firebase
      const folderRef = ref(storage, pathRef);

      try {
        setProfilePath(pathRef);

        const uploadProfile = await uploadBytes(folderRef, file[0]);

        if (user?.uid) {
          const userCollection = doc(fireStore, "users", user?.uid);

          await setDoc(userCollection, {
            name: name,
            username: username,
            profile_path: pathRef
          });

          generateToast({ message: "Successfully upload..", variant: "success" });
        }
      } catch (error) {
        if (error instanceof FirebaseError)
          generateToast({ message: "Oops something went wrong", variant: "error" });
      }
    }
  });

  return { uploadProfile };
};

export { useUpload };
