"use client";

import { getDocs, onSnapshot, collection, orderBy, query } from "firebase/firestore";
import { fireStore as db } from "@/firebase/config";
import { ObjectFieldTypes } from "@/hooks/useUpload";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Card from "./Card";

// type DataTypes = { data: ObjectFieldTypes[] };

const PostCard = () => {
  const [postSource, setPostSource] = useState<ObjectFieldTypes[]>([]);

  const getFeeds = async () => {
    const q = query(collection(db, "feeds"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const feeds = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), createdAt: doc.data().createdAt.toDate().toLocaleDateString() };
    }) as ObjectFieldTypes[];
    setPostSource(feeds);
  };

  const { isLoading } = useQuery("feeds", getFeeds);

  useEffect(() => {
    if (postSource.length) {
      const unsubscribe = onSnapshot(collection(db, "feeds"), (snapshot) => {
        snapshot.docChanges().map((change) => {
          switch (change.type) {
            case "modified":
              return getFeeds();
            case "added":
              return getFeeds();
          }
        });
      });
    }
  }, [postSource.length]);

  return (
    <>
      {postSource.map((post) => (
        <Card
          key={post.id}
          dataSource={post}
          withButton
        />
      ))}
    </>
  );
};

export default PostCard;
