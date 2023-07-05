"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage, fireStore } from "@/firebase/config";
import { collection, doc, setDoc, getDoc, where, query, getDocs } from "firebase/firestore";
import { useMutation } from "react-query";
import useCustomToast from "./useCustomToast";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { RegisteringAssetsType } from "@/components/Navbar/FormSettingProfiles";
import useFirebaseAuth from "./useFirebaseAuth";

export interface TUploadIdentity {
  name: string;
  username: string;
  file_path?: string;
}

const useUpload = () => {
  const { user } = useAuth();
  const { generateToast } = useCustomToast();
  const { setProfileData } = useFirebaseAuth();
  const router = useRouter();

  // const checkUsernameTaken = async (username: string) => {
  //   const collectionRef = collection(fireStore, "users");
  //   const q = query(collectionRef, where("username", "==", username));
  //   const querySnapshot = await getDocs(q);

  //   console.log(querySnapshot);
  // };

  const uploadProfile = useMutation({
    mutationFn: async ({ file, name, username }: RegisteringAssetsType) => {
      // reference folder for keeping content firebase

      if (file) {
        try {
          const fileName = file[0].name;
          const pathRef = `${user?.uid}/profiles/${fileName}`;
          const folderRef = ref(storage, pathRef);

          await uploadBytes(folderRef, file[0]);

          await uploadUserIdentity.mutateAsync({
            name: name,
            username: username,
            file_path: pathRef
          });
        } catch (error) {
          if (error instanceof FirebaseError)
            generateToast({ message: "Oops something went wrong", variant: "error" });
        }
      }
    }
  });

  const uploadUserIdentity = useMutation({
    mutationFn: async ({ name, username, file_path }: TUploadIdentity) => {
      try {
        if (user.uid) {
          const userDocRef = doc(fireStore, "users", user?.uid);

          await setDoc(userDocRef, {
            name: name,
            username: username,
            profile_path: file_path ? file_path : ""
          });

          const downloadedUrl = await getDownloadURL(ref(storage, file_path));

          if (file_path) setProfileData(username, name, downloadedUrl);

          generateToast({ message: "Successfully upload..", variant: "success" });
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  return { uploadProfile, uploadUserIdentity };
};

export { useUpload };
