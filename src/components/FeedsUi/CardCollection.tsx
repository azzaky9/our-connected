"use client";

import { getDocs, collection, orderBy, query } from "firebase/firestore";
import { fireStore as db } from "@/firebase/config";
import { ObjectFieldTypes } from "@/types/type";
import { useState } from "react";
import { useQuery } from "react-query";
import Card from "./Card";

// type DataTypes = { data: ObjectFieldTypes[] };

const CardCollection = () => {
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

  return (
    <article>
      {postSource.map((post) => (
        <Card
          key={post.id}
          isLoading={isLoading}
          dataSource={post}
          withButton
        />
      ))}
    </article>
  );
};

export default CardCollection;
