import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import AnimateType from "@/components/AnimateTyping";

interface TRegisterScreenProps {
  title: string;
  description: string;
  footerContent: React.ReactElement;
  children: React.ReactNode;
}

const RegisterScreen: React.FC<TRegisterScreenProps> = ({
  title,
  description,
  footerContent,
  children
}) => {
  return (
    <section className='h-screen flex flex-row-reverse w-full'>
      <div className='basis-3/5 flex flex-col justify-center p-5 font-semibold text-white '>
        <AnimateType />
      </div>
      <div className='flex items-center mr-20 '>
        <Card className='w-[350px] '>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
          <CardFooter>{footerContent}</CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default RegisterScreen;
