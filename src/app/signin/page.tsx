import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import Form from "@/components/form/form";
import AnimateTyping from "@/components/AnimateTyping";
import Link from "next/link";

const page = () => {
  return (
    <section className='h-screen flex flex-row-reverse w-full'>
      <div className='basis-3/5 flex flex-col justify-center p-5 font-semibold text-white '>
        <AnimateTyping />
      </div>
      <div className='flex items-center mr-20 '>
        <Card className='w-[350px] '>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Login your account for access this app</CardDescription>
          </CardHeader>
          <CardContent>
            <Form />
          </CardContent>
          <CardFooter>
            <CardDescription className='text-[0.768rem] text-center'>
              Not already have account? you can sign up
              <Link
                className='text-blue-600'
                href='signup'>
                {" "}
                here
              </Link>
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default page;
