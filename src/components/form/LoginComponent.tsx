"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, Resolver } from "react-hook-form";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import PasswordInputs from "./PasswordInputs";
import { BsGoogle } from "react-icons/bs";
import { Loader } from "lucide-react";

export interface LoginValuesInput {
  email: string;
  password: string;
}

const resolver: Resolver<LoginValuesInput> = async (values) => {
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

const LoginComponent = () => {
  const { loginUser, signinWithGoogleAuth, errorAuthMessage, isAuthError } = useFirebaseAuth();
  const { isLoading, isError } = loginUser;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginValuesInput>({ resolver });

  const onSubmits = handleSubmit((inputValue) => {
    const { email, password } = inputValue;

    loginUser.mutate({ email: email, password: password });
  });

  return (
    <React.Fragment>
      <form
        onSubmit={onSubmits}
        className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            {...register("email")}
            id='email'
            type='email'
            placeholder='our-connected@connect.com'
            autoComplete='off'
            className='border-slate-800 w-full placeholder:text-sm bg-transparent text-white outline-none focus-visible:border focus-visible:border-zinc-800 ring-offset-slate-600'
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <PasswordInputs
            {...register("password")}
            theme='light'
            id='password'
            autoComplete='off'
            className='border-slate-800 w-full placeholder:text-sm bg-transparent text-white outline-none focus-visible:border focus-visible:border-zinc-800 ring-offset-slate-600'
          />
          {isAuthError ? (
            <span className='text-red-600 text-[0.700rem]'>{errorAuthMessage}</span>
          ) : null}
        </div>
        <Button
          disabled={isLoading}
          type='submit'
          className='w-full bg-white text-black hover:bg-gray-200 '>
          {isLoading ? <Loader className='animate-spin' /> : "Sign in with Email"}
        </Button>
      </form>
      <div className='relative my-5'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-zinc-800' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-slate-950 px-2 text-slate-50'>Or continue with</span>
        </div>
      </div>
      <div className='grid'>
        <Button
          disabled={signinWithGoogleAuth.isLoading}
          variant='outline'
          onClick={() => signinWithGoogleAuth.mutate()}>
          <BsGoogle className='mr-2 h-4 w-4' />
          Google
        </Button>
      </div>
    </React.Fragment>
  );
};

export default LoginComponent;
