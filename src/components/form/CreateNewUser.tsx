"use client";

import React, { memo, useState, useEffect } from "react";
import { FieldError, Resolver, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
// import useFirebaseAuth from "@/hooks/useFirebaseAuth";
// import { auth } from "@/firebase/config";
// import { onAuthStateChanged } from "firebase/auth";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { AtSign, Lock, User2, Loader } from "lucide-react";
import { type LoginValuesInput } from "./LoginComponent";
import { useRouter } from "next/navigation";

import VerificationSended from "../RegisterUi/VerificationSended";
import PasswordInputs from "../form/PasswordInputs";

export interface CreateNewUserValues extends LoginValuesInput {
  username: string;
  name: string;
}

interface ErrorMessage {
  email?: FieldError;
  password?: FieldError;
  username?: FieldError;
  name?: FieldError;
}

const resolver: Resolver<CreateNewUserValues> = (data) => {
  const errors: ErrorMessage = {};
  const paswordRegExp = /^(?=.{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/g;
  const nameRegExp = /^[a-zA-Z ]+$/i;
  const usernameRegExp = /^[a-z0-9_-]+$/i;

  if (!data.email) {
    errors.email = { type: "required", message: "email is required" };
  } else if (data.email && !data.email.toLowerCase().includes("@")) {
    errors.email = { type: "onChange", message: "Please filled with valid email" };
  }

  if (!data.password) {
    errors.email = { type: "required", message: "password is required" };
  } else if (data.password && !data.password?.match(paswordRegExp)) {
    errors.password = {
      type: "onChange",
      message:
        "Password must contain at least 8 characters, one symbol, one uppercase letter, and one number."
    };
  }

  if (!data.name) {
    errors.name = { type: "required", message: "name is required" };
  } else if (data.name && !data.name?.match(nameRegExp)) {
    errors.name = {
      type: "onChange",
      message: "Name must not contain any symbol and only accept text."
    };
  }

  if (!data.username) {
    errors.username = { type: "required", message: "username is required" };
  } else if (data.username && !data.username.match(usernameRegExp)) {
    errors.username = {
      type: "onChange",
      message:
        "Username must not contain uppercase letters and only accept numbers, text, '_', and '-'."
    };
  }

  return {
    values: data,
    errors
  };
};

const DisplayErrorMessage = memo(function DisplayErrorMessage({
  message
}: {
  message: string | undefined;
}) {
  return (
    <React.Fragment>
      {message && <span className='text-red-500 text-[0.8rem]'>{`(${message})`}</span>}
    </React.Fragment>
  );
});

const CreateNewUserForm = () => {
  const [emailUser, setEmailUser] = useState("");
  const { createNewUser } = useFirebaseAuth();
  const { isLoading, isSuccess } = createNewUser;
  const { setProfileData } = useFirebaseAuth();

  // const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateNewUserValues>({ resolver });

  const onSubmit = handleSubmit((values) => {
    setEmailUser(values.email);

    createNewUser.mutate(values);
  });

  return (
    <div
      className={`relative grid place-content-center bg-zinc-900 p-10 shadow-xl transition-all duration-500 delay-900 rounded-md w-[420px]  ${
        isSuccess ? "max-h-[180px]" : "max-h-[520px]"
      } overflow-y-hidden`}>
      {emailUser ? (
        <VerificationSended
          email={emailUser}
          operationSuccess={isSuccess}
        />
      ) : null}
      <form
        onSubmit={onSubmit}
        className={`z-20 ${
          isSuccess ? "translate-y-[110%]" : ""
        } transition duration-300 flex flex-col gap-10`}>
        <Label htmlFor='email'>
          <span className='flex mt-2 items-center gap-2'>
            <AtSign size={16} /> Email
          </span>
          <Input
            {...register("email")}
            disabled={isLoading}
            id='email'
            type='email'
            className='border-slate-700 border-2 w-full placeholder:text-sm bg-transparent text-white outline-none focus-visible:border focus-visible:border-zinc-800 ring-offset-slate-600'
          />
          {errors.email && errors.email?.type === "required" ? (
            <DisplayErrorMessage message='email is required' />
          ) : errors.email && errors.email?.type === "onChange" ? (
            <DisplayErrorMessage message={errors.email.message} />
          ) : null}
        </Label>
        <Label htmlFor='title'>
          <span className='flex mt-2 items-center gap-2'>
            <Lock size={16} /> Password
          </span>
          <PasswordInputs
            {...register("password")}
            theme='light'
            disabled={isLoading}
            className='border-slate-700 border-2 w-full placeholder:text-sm bg-transparent text-white outline-none focus-visible:border focus-visible:border-zinc-800 ring-offset-slate-600'
          />
          {errors.password && errors.password.type === "required" ? (
            <DisplayErrorMessage message='password is required' />
          ) : errors.password && errors.password.type === "onChange" ? (
            <DisplayErrorMessage message={errors.password.message} />
          ) : null}
        </Label>
        <Label htmlFor='username'>
          <span className='flex mt-2 items-center gap-2'>
            <User2 size={16} /> username
          </span>
          <Input
            {...register("username")}
            id='username'
            disabled={isLoading}
            type='text'
            className='border-slate-700 border-2 w-full placeholder:text-sm bg-transparent text-white outline-none focus-visible:border focus-visible:border-zinc-800 ring-offset-slate-600'
          />
          {errors.username && errors.username.type === "required" ? (
            <DisplayErrorMessage message='username is required' />
          ) : errors.username?.type === "onChange" ? (
            <DisplayErrorMessage message={errors.username.message} />
          ) : null}
        </Label>
        <Label htmlFor='name'>
          <span className='flex mt-2 items-center gap-2'>
            <User2 size={16} /> name
          </span>
          <Input
            {...register("name")}
            id='name'
            disabled={isLoading}
            type='text'
            className='border-slate-700 border-2 w-full placeholder:text-sm bg-transparent text-white outline-none focus-visible:border focus-visible:border-zinc-800 ring-offset-slate-600'
          />
          {errors.name && errors.name.type === "required" ? (
            <DisplayErrorMessage message='name is required' />
          ) : errors.name?.type === "onChange" ? (
            <DisplayErrorMessage message={errors.name.message} />
          ) : null}
        </Label>
        <Button
          className='bg-gray-800'
          disabled={isLoading}
          type='submit'
          onClick={onSubmit}>
          {isLoading ? <Loader className='animate-spin' /> : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewUserForm;
