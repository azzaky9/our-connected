import { Timestamp } from 'firebase/firestore'

interface TUploadIdentity {
  name: string
  username: string
  filePath: string
}

interface TArgsUploadContent {
  title: string
  content: string
}

interface ObjectFieldTypes extends TArgsUploadContent {
  id: string
  createdAt: Timestamp | string
  postedBy: string
  likeBlog: Array<string>
}

export { type ObjectFieldTypes, type TUploadIdentity, type TArgsUploadContent }
