import { CardDescription } from "@/components/ui/card";
import Link from "next/link";
import RegisterScreen from "@/components/RegisterScreen";
import Form from "@/components/form/form";

const page = () => {
  const signFooterHelperText = (
    <CardDescription className='text-[0.768rem] text-center'>
      Already Have Account you can login
      <Link
        className='text-blue-600'
        href='/register/signin'>
        {" "}
        here
      </Link>
    </CardDescription>
  );

  return (
    <RegisterScreen
      title='Sign Up'
      description='Create Your Account with your own email and password'
      footerContent={signFooterHelperText}>
      <Form model='Sign Up' />
    </RegisterScreen>
  );
};

export default page;
