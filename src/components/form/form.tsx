"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdOutlineMail } from "react-icons/md";
import { useForm, Resolver } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

type FormInput = {
  email: string;
  password: string;
};

const resolver: Resolver<FormInput> = async (values) => {
  return {
    values: values.email && values.password ? values : {},
    errors:
      !values.email || !values.password
        ? {
            email: {
              type: "onChange",
              message: "email must not empty"
            },
            password: {
              type: "onChange",
              message: "password must not empty"
            }
          }
        : {}
  };
};

const Form = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ resolver });

  const onSubmits = handleSubmit(({ email, password }) => {
    console.log(email);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        router.replace("/feeds");
      })
      .catch((err) => console.error(err));
  });

  return (
    <form onSubmit={onSubmits}>
      <div className='grid w-full items-center mt-3 gap-4'>
        <div className='flex flex-col space-y-3'>
          <Label htmlFor='email'>@ Email</Label>
          <Input
            {...register("email")}
            className='text-slate-900'
            type='email'
            id='email'
            placeholder='Enter you email'
          />
          <span className='text-red-700 text-sm'>{errors.email ? errors.email.message : null}</span>
        </div>
        <div className='flex flex-col space-y-1.5'>
          <Label htmlFor='email'>Password</Label>

          <Input
            {...register("password")}
            type='password'
            className='text-slate-900'
            id='password'
            placeholder='Enter your Password'
          />

          <span className='text-red-700 text-sm'>
            {errors.password ? errors.password.message : null}
          </span>
        </div>
        <Button
          variant='default'
          className='w-full flex gap-2 justify-center mt-5'>
          <MdOutlineMail fontSize='1.182rem' />
          Sign in
        </Button>
      </div>
    </form>
  );
};

export default Form;
