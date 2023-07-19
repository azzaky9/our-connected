import DisplayBlog from './DisplayBlog'

// const getOwnPost = async (id: string) => {
//   const q = collection(db, 'feeds')
//   const docSnapshot = await getDocs(q)

//   const resultSource = docSnapshot.docs.map((doc) => {
//     const data = doc.data()

//     return { ...data, createdAt: data.createdAt.toDate().toLocaleDateString() }
//   }) as ObjectFieldTypes[]

//   const finalResult = resultSource.filter(
//     (doc) => doc.whoPosted.userRef === `/users/${id}`
//   )

//   return finalResult
// }

const page = ({ params }: { params: { uid: string } }) => {
  return (
    <main>
      <DisplayBlog id={params.uid} />
    </main>
  )
}

export default page
