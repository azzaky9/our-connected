import { Timestamp, DocumentReference } from "firebase/firestore";

interface TUploadIdentity {
  name: string;
  username: string;
  file_path?: string;
}

interface TArgsUploadContent {
  title: string;
  content: string;
}

interface ObjectFieldTypes extends Pick<TArgsUploadContent, "content" | "title"> {
  id: string;
  createdAt: Timestamp | string;
  whoPosted: {
    userRef: string;
  };
  likeCount: Array<string>;
  loveCount: Array<string>;
}

export { type ObjectFieldTypes, type TUploadIdentity, type TArgsUploadContent };
