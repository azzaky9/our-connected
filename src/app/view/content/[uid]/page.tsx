import DisplayUserBlog from './DisplayUserBlog'
import { fireStore as db } from '@/firebase/config'
import { query, where, collection, getDocs } from 'firebase/firestore'
import { ObjectFieldTypes } from '@/types/type'

const page = async ({ params }: { params: { uid: string } }) => {
  const collectionRef = collection(db, 'feeds')

  const q = query(collectionRef, where('postedBy', '==', params.uid))
  const snapshot = await getDocs(q)

  const resultSource = snapshot.docs.map((doc) => {
    const data = doc.data()

    return {
      ...data,
      createdAt: data.createdAt.toDate().toLocaleDateString(),
    }
  }) as ObjectFieldTypes[]

  return (
    <main>
      <DisplayUserBlog userId={params.uid} initialData={resultSource} />
    </main>
  )
}

export default page
