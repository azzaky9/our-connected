"use client";

/*
 * Structure Object
 * unique id
 * title
 * whoPosted
 * createdAt
 * description / content
 * love & like (inc)
 */

import { useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Resolver, useForm } from "react-hook-form";
import { useUpload } from "@/hooks/useUpload";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface TCreateNewPostForm {
  title: string;
  content: string;
}

const NewPost = () => {
  const { uploadContent } = useUpload();
  const [inputValue, setInputValue] = useState("");
  const maxWordCount = 1000;
  const remainingWord = maxWordCount - inputValue.split(" ").length;
  const { mutate, isLoading } = uploadContent;

  const {
    handleSubmit,
    register,
    clearErrors,
    formState: { errors }
  } = useForm<TCreateNewPostForm>();

  const onSubmit = (data: TCreateNewPostForm) => {
    const { content, title } = data;
    const { mutate } = uploadContent;

    mutate({ content: content, title: title });
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='grid gap-y-5 py-5 text-zinc-600'>
      <div className='grid w-full items-center'>
        <Label htmlFor='title'>Title</Label>
        <Input
          {...register("title", { required: true, onChange: () => clearErrors() })}
          id='title'
          type='text'
          disabled={isLoading}
          className='border-slate-800 w-full bg-transparent placeholder:text-sm text-white outline-none focus-visible:border focus-visible:border-zinc-800 ring-offset-slate-600'
        />
        {errors.title && renderErrorMessage}
      </div>
      <div className='grid w-full gap-1.5'>
        <Textarea
          {...register("content", { required: true, onChange: () => clearErrors() })}
          className='border-slate-800 resize-none shadow-[-1px_-43px_53px_-23px_rgba(0, 0, 0, 0.232)inset]  h-[220px] placeholder:text-zinc-600 text-white focus-visible:border focus-visible:border-zinc-800 ring-offset-slate-600'
          value={inputValue}
          onChange={handleChangeTextArea}
          disabled={isLoading}
          placeholder='Describe your content here...'
          id='description'
        />
        {errors.content && renderErrorMessage}
        <span className={`${remainingWord <= 10 ? "text-red-600" : "text-zinc-600"} text-sm py-3`}>
          {remainingWord} / {maxWordCount}
        </span>
      </div>

      <Button
        type='submit'
        disabled={isLoading}>
        {isLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Submit"}{" "}
      </Button>
    </form>
  );
};

export default NewPost;
