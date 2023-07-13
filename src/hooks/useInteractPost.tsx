"use client";

import { useEffect, useState } from "react";
import { fireStore as db } from "@/firebase/config";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { ObjectFieldTypes } from "@/types/type";

const useInteractPost = (docsId: string) => {
  const { user } = useAuth();
  const docsRef = doc(db, "feeds", docsId);
  const [lastInterestCount, setLastInterestCount] = useState({
    loveCount: 0,
    likeCount: 0
  });
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
          setLastInterestCount((prevState) => ({
            ...prevState,
            [action.interestType]:
              modelFn === "like" ? lastInterestCount.likeCount + 1 : lastInterestCount.loveCount + 1
          }));
        })
        .catch((err) => console.log(err));
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
          setLastInterestCount((prevState) => ({
            ...prevState,
            [action.interestType]:
              modelFn === "like" ? lastInterestCount.likeCount - 1 : lastInterestCount.loveCount - 1
          }));
        })
        .catch((err) => console.log(err));
    });
  };

  useEffect(() => {
    const getLastLenghtInterest = async () => {
      const documents = await getDoc(docsRef);

      if (documents.exists()) {
        const docSnapshot = documents.data() as ObjectFieldTypes;
        setLastInterestCount({
          likeCount: docSnapshot.likeCount.length,
          loveCount: docSnapshot.loveCount.length
        });
      }
    };

    getLastLenghtInterest();
  }, [docsRef]);

  return { incrementInterest, undoInterest, interest, lastInterestCount };
};

export { useInteractPost };
