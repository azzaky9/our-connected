"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useUpload } from "@/hooks/useUpload";
import { TUploadIdentity } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

// type TInputValue = { userName: string; name: string };

const Page = () => {
  const { uploadUserIdentity } = useUpload();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TUploadIdentity>();
  const router = useRouter();

  const onSubmit = handleSubmit((inputValue) => {
    const { name, username } = inputValue;
    const { mutateAsync } = uploadUserIdentity;

    mutateAsync({ name: name, username: username }).then(() => {
      router.push("/feeds");
    });
  });

  return (
    <div className='h-screen flex items-start justify-center p-10'>
      <Card className='w-[340px]'>
        <CardHeader>
          <CardTitle className='text-base'>Almost Theree...</CardTitle>
          <CardDescription>Set up your public username and Your actual Name</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className='grid gap-3'
            onSubmit={onSubmit}>
            <div>
              <Label>Username</Label>
              <Input
                {...register("username")}
                type='text'
                placeholder='@username'
              />
              <p>{errors ? errors.username?.message : null}</p>
            </div>
            <div>
              <Label>Name</Label>
              <Input
                {...register("name")}
                type='text'
                placeholder='@name'
              />
            </div>
            <Button
              type='submit'
              className='mt-3'>
              {uploadUserIdentity.isLoading ? "please wait..." : "submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
