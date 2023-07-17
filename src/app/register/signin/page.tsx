import Link from "next/link";
import LoginComponent from "@/components/form/LoginComponent";
import AnimateType from "@/components/AnimateTyping";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GithubIcon } from "lucide-react";
import { BsGoogle, BsGithub } from "react-icons/bs";
import PasswordInputs from "@/components/form/PasswordInputs";

//  <RegisterScreen
//       title='Sign in'
//       description='Login your account for access this app'
//       footerContent={signFooterHelperText}>
//       <Form model='Sign In' />
//     </RegisterScreen>

const page = () => {
  return (
    <main className='h-screen grid place-content-center lg:grid-cols-5'>
      <div className='grid place-content-center col-span-2'>
        <Card className='max-w-[380px] w-full max-[400px]:border-none'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl'>Sign In</CardTitle>
            <CardDescription>Enter your email below to access this app</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginComponent />
          </CardContent>
          <CardFooter>
            <Link
              href='./signup'
              className=' text-zinc-600 text-sm'>
              Not already have account? yo can sign up here{" "}
              <span className='text-blue-600'>here</span>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <aside className='xl:flex flex-col col-span-3 justify-center font-semibold text-white hidden'>
        <AnimateType />
      </aside>
    </main>
  );
};

export default page;
