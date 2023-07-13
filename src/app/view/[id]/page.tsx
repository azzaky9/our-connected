import React from "react";
import Card from "@/components/FeedsUi/Card";
import { fireStore } from "@/firebase/config";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { ObjectFieldTypes } from "@/types/type";

const page = async ({ params }: { params: { id: string } }) => {
  const documentIdRef = doc(fireStore, "feeds", params.id);
  const getPost = await getDoc(documentIdRef);
  const postSource = getPost.data() as ObjectFieldTypes;

  return (
    <div className='h-screen'>
      {postSource.createdAt instanceof Timestamp ? (
        <Card
          withButton={false}
          dataSource={{
            ...postSource,
            createdAt: postSource.createdAt.toDate().toLocaleDateString()
          }}
        />
      ) : null}
    </div>
  );
};

export default page;
