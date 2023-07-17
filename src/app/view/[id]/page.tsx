import GetSpecificBlog from "@/components/GetSpecificBlog";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className='h-screen'>
      <GetSpecificBlog blogId={params.id} />
    </div>
  );
};

export default page;
