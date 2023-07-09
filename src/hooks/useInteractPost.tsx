"use client";

import { fireStore as db } from "@/firebase/config";
import {
  increment,
  doc,
  updateDoc,
  getDoc,
  collection,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/context/AuthContext";
import { ObjectFieldTypes } from "./useUpload";
import { MdDocumentScanner } from "react-icons/md";

export type ParamInterestTypes = "loveCount" | "likeCount";

const useInteractPost = (docsId: string) => {
  const { user } = useAuth();
  const docsRef = doc(db, "feeds", docsId);

  const checkUserExistOnField = async () => {
    try {
      const documents = await getDoc(docsRef);

      if (documents.exists()) {
        const docSnapshot = documents.data() as ObjectFieldTypes;
        const findIndexUser = docSnapshot.loveCount.findIndex((pid) => pid === user.uid);
        return findIndexUser >= 0 ? true : false;
      }
    } catch (error) {
      if (error instanceof FirebaseError) throw error.message;
    }
  };

  const incrementInterest = (interestType: ParamInterestTypes) => {
    checkUserExistOnField()
      .then((isUserOnField) => {
        if (typeof isUserOnField === "boolean") {
          if (!isUserOnField) {
            updateDoc(docsRef, {
              [interestType]: arrayUnion(user.uid)
            }).then(() => console.log("successfully Created"));
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const undoInterest = (interestType: ParamInterestTypes) => {
    checkUserExistOnField()
      .then((isUserOnField) => {
        if (typeof isUserOnField === "boolean") {
          if (isUserOnField) {
            updateDoc(docsRef, {
              [interestType]: arrayRemove(user.uid)
            })
              .then(() => console.log("successfully removed"))
              .catch((err) => console.error(err));
          }
        }
      })
      .catch((err) => console.error(err));
  };

  return { incrementInterest, undoInterest, checkUserExistOnField };
};

export { useInteractPost };
