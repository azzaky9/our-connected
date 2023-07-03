import { CardDescription } from "@/components/ui/card";
import Link from "next/link";
import RegisterScreen from "@/components/RegisterScreen";
import Form from "@/components/form/form";

const page = () => {
  const signFooterHelperText = (
    <CardDescription className='text-[0.768rem] text-center'>
      Not already have account? you can sign up
      <Link
        className='text-blue-600'
        href='./signup'>
        {" "}
        here
      </Link>
    </CardDescription>
  );

  return (
    <RegisterScreen
      title='Sign in'
      description='Login your account for access this app'
      footerContent={signFooterHelperText}>
      <Form model='Sign In' />
    </RegisterScreen>
  );
};

export default page;
