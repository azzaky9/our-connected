"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdOutlineMail } from "react-icons/md";
import { useForm, Resolver } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { useCallback } from "react";

export type FormInput = {
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

interface TFormProps {
  model: "Sign In" | "Sign Up";
}

const Form: React.FC<TFormProps> = ({ model }) => {
  const { mutationLogin, mutationRegister } = useFirebaseAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ resolver });

  const onSubmits = handleSubmit((inputValue) => {
    return model === "Sign In"
      ? mutationLogin.mutate({ email: inputValue.email, password: inputValue.password })
      : mutationRegister.mutate({ email: inputValue.email, password: inputValue.password });
  });

  const generateLoadingBooleans = useCallback(() => {
    if (mutationLogin.isLoading || mutationRegister.isLoading) {
      return true;
    }

    return false;
  }, [mutationLogin.isLoading, mutationRegister.isLoading]);

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
          type='submit'
          variant='default'
          className='w-full flex gap-2 justify-center mt-5'>
          {generateLoadingBooleans() ? (
            <>
              <span>Please Wait</span>
              <AiOutlineLoading3Quarters className='animate-spin' />
            </>
          ) : (
            <>
              <MdOutlineMail fontSize='1.182rem' />
              <span>{model === "Sign In" ? "Sign in" : "Sign up"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default Form;
