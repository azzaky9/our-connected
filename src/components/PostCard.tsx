import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "../components/ui/button";
import { BiSolidLike } from "react-icons/bi";
import { FcLike } from "react-icons/fc";

interface TPostCard {
  uploadedName: string;
  datePost: string;
  title: string;
  content: string;
}

const PostCard: React.FC<TPostCard> = ({ uploadedName, datePost, title, content }) => {
  return (
    <Card className='max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {datePost} / {uploadedName}
        </CardDescription>
      </CardHeader>
      <CardContent className='text-sm'>{content}</CardContent>
      <CardFooter>
        <div className='flex justify-between items-center w-full'>
          <div className='flex gap-5'>
            <FcLike className='text-lg hover:scale-125 hover:text-rose-400 active:scale-75 cursor-pointer transition duration-300' />
            <BiSolidLike className='text-lg text-white hover:scale-125 hover:text-blue-600 active:scale-75 cursor-pointer transition duration-300' />
          </div>
          <Button
            variant='default'
            className='hover:bg-rose-600 flex gap-2 justify-center'>
            Detail
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
