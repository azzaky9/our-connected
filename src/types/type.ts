import { Timestamp, DocumentReference } from "firebase/firestore";

interface TUploadIdentity {
  name: string;
  username: string;
  filePath: string;
}

interface TArgsUploadContent {
  title: string;
  content: string;
}

interface ObjectFieldTypes extends Pick<TArgsUploadContent, "content" | "title"> {
  id: string;
  createdAt: Timestamp;
  whoPosted: {
    userRef: string;
  };
  likeCount: Array<string>;
  loveCount: Array<string>;
}

export { type ObjectFieldTypes, type TUploadIdentity, type TArgsUploadContent };
