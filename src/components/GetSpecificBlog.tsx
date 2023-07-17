"use client";

import React from "react";
import Card from "./FeedsUi/Card";
import { useQuery } from "react-query";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { ObjectFieldTypes } from "@/types/type";

const GetSpecificBlog = ({ blogId }: { blogId: string }) => {
  const getBlog = async () => {
    const documentIdRef = doc(fireStore, "feeds", blogId);
    const blogSnapshot = await getDoc(documentIdRef);

    if (blogSnapshot.exists()) {
      const postSource = blogSnapshot.data() as ObjectFieldTypes;

      return postSource;
    }
  };

  const { data, isLoading } = useQuery("resultBlog", getBlog);

  return (
    <React.Fragment>
      {data ? (
        <Card
          dataSource={data}
          withButton={false}
          isLoading={isLoading}
        />
      ) : (
        <p>Blog Not Found</p>
      )}
    </React.Fragment>
  );
};

export default GetSpecificBlog;
