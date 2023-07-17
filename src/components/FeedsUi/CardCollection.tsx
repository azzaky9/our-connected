"use client";

import React from "react";
import { getDocs, collection, orderBy, query } from "firebase/firestore";
import { fireStore as db } from "@/firebase/config";
import { ObjectFieldTypes } from "@/types/type";
import { useState } from "react";
import { useQuery } from "react-query";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";

// type DataTypes = { data: ObjectFieldTypes[] };

const CardCollection = () => {
  const [postSource, setPostSource] = useState<ObjectFieldTypes[]>([]);

  const getFeeds = async () => {
    const q = query(collection(db, "feeds"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const feeds = querySnapshot.docs.map((doc) => {
      return doc.data();
    }) as ObjectFieldTypes[];

    setPostSource(feeds);
  };

  const { isLoading } = useQuery("feeds", getFeeds);

  return (
    <React.Fragment>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        postSource.map((sourceValue) => (
          <Card
            dataSource={sourceValue}
            withButton
            key={sourceValue.id}
          />
        ))
      )}
    </React.Fragment>
  );
};

export default CardCollection;
