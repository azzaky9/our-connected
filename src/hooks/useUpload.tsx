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
  updateDoc,
  arrayUnion
} from "firebase/firestore";
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

interface TArgsUploadContent {
  title: string;
  content: string;
}

const useUpload = () => {
  const { user } = useAuth();
  const { generateToast } = useCustomToast();
  const { setProfileData } = useFirebaseAuth();
  const cloudStorageKey = process.env.NEXT_PUBLIC_STORAGE_ID;

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

  const uploadProfile = useMutation({
    mutationFn: async ({ file, name, username }: RegisteringAssetsType) => {
      if (file) {
        try {
          const fileName = file[0].name;
          const pathRef = `${user?.uid}/profiles/${fileName}`;
          const folderRef = ref(storage, pathRef);

          await uploadBytes(folderRef, file[0]);

          uploadUserIdentity.mutate({
            name: name,
            username: username,
            file_path: pathRef
          });
        } catch (error) {
          if (error instanceof FirebaseError)
            generateToast({ message: error.message, variant: "error" });
        }
      }
    }
  });

  const uploadUserIdentity = useMutation({
    mutationFn: async ({ name, username, file_path }: TUploadIdentity) => {
      try {
        if (user.uid) {
          const userDocRef = doc(fireStore, "users", user.uid);
          const isPathValid = Boolean(file_path);

          if (isPathValid) {
            const downloadedUrl = await getDownloadURL(ref(storage, file_path));

            await setDoc(userDocRef, {
              name: name,
              username: username,
              profile_path: downloadedUrl
            });
          } else {
            await setDoc(userDocRef, {
              name: name,
              username: username,
              profile_path: ""
            });

            setProfileData(name, username, "");
          }

          generateToast({ message: "Successfully upload..", variant: "success" });
        }
      } catch (error) {
        generateToast({ message: "Oops Something went wrong", variant: "error" });
      }
    }
  });

  const uploadContent = useMutation({
    mutationFn: async ({ content, title }: TArgsUploadContent) => {
      try {
        const contentsField = {
          id: "",
          title: title,
          content: content,
          createdAt: Date.now(),
          whoPosted: "",
          like_count: 0,
          love_count: 0
        };

        const documentRef = doc(fireStore, "posts", "feeds_documents");

        await updateDoc(documentRef, {
          feeds: arrayUnion(contentsField)
        });

        generateToast({ message: "Successfully Upload", variant: "success" });
      } catch (error) {
        if (error instanceof FirebaseError) console.log(error.message);
      }
    }
  });

  return { uploadProfile, uploadUserIdentity, uploadContent, checkUsernameAvailability };
};

export { useUpload };
