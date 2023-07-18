"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useUpload } from "@/hooks/useUpload";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useCustomToast from "@/hooks/useCustomToast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TCreateNewPostForm {
  title: string;
  content: string;
}

const NewPost = () => {
  const { uploadContent } = useUpload();
  const [inputValue, setInputValue] = useState("");
  const { generateToast } = useCustomToast();
  const maxWordCount = 1000;
  const remainingWord = maxWordCount - inputValue.split(" ").length;
  const { isLoading } = uploadContent;
  const router = useRouter();

  const {
    handleSubmit,
    register,
    clearErrors,
    resetField,
    formState: { errors }
  } = useForm<TCreateNewPostForm>();

  const onSubmit = (data: TCreateNewPostForm) => {
    const { content, title } = data;
    const { mutateAsync } = uploadContent;

    mutateAsync({ content: content, title: title })
      .then(() => {
        generateToast({ variant: "success", message: "successfully upload" });
        resetField("content");
        resetField("title");
        router.push("/view/feeds");
      })
      .catch((err) => {
        generateToast({ variant: "error", message: "Ooop something went wrong" });
      });
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (remainingWord === 0 && e.target.value.length > inputValue.length) {
      e.preventDefault(); // Prevent typing when remainder is zero
      return;
    }

    setInputValue(e.target.value);
  };

  const renderErrorMessage = (
    <span className='text-[0.8rem] text-red-600'>This field must be required</span>
  );

  return (
    <Card className='max-w-[468px] w-full bg-zinc-900'>
      <CardHeader>
        <CardTitle>Create Your New Post</CardTitle>
        <CardDescription>make sure you write in good and polite words</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid text-zinc-600'>
          <div className='grid w-full items-center mb-5'>
            <Label htmlFor='title'>Title</Label>
            <Input
              {...register("title", { required: true, onChange: () => clearErrors() })}
              id='title'
              type='text'
              disabled={isLoading}
              className='input-styles'
            />
            {errors.title && renderErrorMessage}
          </div>
          <div className='grid w-full gap-1.5'>
            <Textarea
              {...register("content", { required: true, onChange: () => clearErrors() })}
              className='input-styles resize-none shadow-[-1px_-43px_53px_-23px_rgba(0, 0, 0, 0.232)inset]  h-[220px] '
              value={inputValue}
              onChange={handleChangeTextArea}
              disabled={isLoading}
              placeholder='Describe your content here...'
              id='description'
            />
            {errors.content && renderErrorMessage}
          </div>
          <span
            className={`${remainingWord <= 10 ? "text-red-600" : "text-zinc-600"} text-sm py-3`}>
            {remainingWord} / {maxWordCount}
          </span>
        </form>
      </CardContent>
      <CardFooter>
        <div className='w-full flex justify-between'>
          <Link href='./feeds'>
            <Button
              type='submit'
              variant='destructive'
              disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSubmit(onSubmit)}
            type='submit'
            disabled={isLoading}>
            {isLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Submit"}{" "}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewPost;
