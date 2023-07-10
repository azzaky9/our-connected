"use client";

import { useEffect, useState, useCallback } from "react";
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

type StateKeyTypes = "alreadyLove" | "alreadyLike";

const useInteractPost = (docsId: string) => {
  const { user } = useAuth();
  const docsRef = doc(db, "feeds", docsId);
  const [interest, setInterest] = useState({
    alreadyLove: false,
    alreadyLike: false
  });

  const checkUserExistOnField = async () => {
    const documents = await getDoc(docsRef);

    if (documents.exists()) {
      const docSnapshot = documents.data() as ObjectFieldTypes;
      const isUserOnLoveField = docSnapshot.loveCount.find((personId) => personId === user.uid);
      const isUserOnLikeField = docSnapshot.likeCount.find((personId) => personId === user.uid);
      return { isUserOnLikeField, isUserOnLoveField };
    }
  };

  const modifiedInterest = (condition: boolean, attr: string) => {
    setInterest((prevState) => ({
      ...prevState,
      [attr]: condition
    }));
  };

  const getSpecifyAction = (modelFn: "like" | "love") => {
    const chooseModel =
      modelFn === "like"
        ? { interestType: "likeCount", setStateKey: "alreadyLike" }
        : {
            interestType: "loveCount",
            setStateKey: "alreadyLove"
          };

    return chooseModel;
  };

  const incrementInterest = (modelFn: "like" | "love") => {
    const action = getSpecifyAction(modelFn);

    checkUserExistOnField().then((person) => {
      updateDoc(docsRef, {
        [action.interestType]: arrayUnion(user.uid)
      })
        .then(() => {
          modifiedInterest(true, action.setStateKey);
        })
        .catch((err) => (err instanceof FirebaseError ? err : null));
    });
  };

  const undoInterest = (modelFn: "like" | "love") => {
    const action = getSpecifyAction(modelFn);

    checkUserExistOnField().then((person) => {
      updateDoc(docsRef, {
        [action.interestType]: arrayRemove(user.uid)
      })
        .then(() => {
          modifiedInterest(false, action.setStateKey);
        })
        .catch((err) => (err instanceof FirebaseError ? err : null));
    });
  };

  return { incrementInterest, undoInterest, interest };
};

export { useInteractPost };
