import CardCollection from '@/components/FeedsUi/CardCollection'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
import { fireStore as db } from '@/firebase/config'
import { type ObjectFieldTypes } from '@/types/type'

export const convertFeedsData = async () => {
  const q = query(collection(db, 'feeds'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)

  const resultSource = querySnapshot.docs.map((doc) => {
    const data = doc.data()

    return { ...data, createdAt: data.createdAt.toDate().toLocaleDateString() }
  }) as ObjectFieldTypes[]

  return resultSource
}

const page = async () => {
  const feeds = await convertFeedsData()

  return (
    <main className='pt-20'>
      <CardCollection source={feeds} />
    </main>
  )
}

export default page
