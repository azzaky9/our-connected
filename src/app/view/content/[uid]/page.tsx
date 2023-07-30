import DisplayUserBlog from './DisplayUserBlog'

const page = ({ params }: { params: { uid: string } }) => {
  return (
    <main>
      <DisplayUserBlog userId={params.uid} />
    </main>
  )
}

export default page
