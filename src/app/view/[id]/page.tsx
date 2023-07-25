import GetSpecificBlog from '@/components/Actionbutton/GetSpecificBlog'

const page = ({ params }: { params: { id: string } }) => {
  return (
    <main className='min-h-screen h-fit'>
      <GetSpecificBlog blogId={params.id} />
    </main>
  )
}

export default page
