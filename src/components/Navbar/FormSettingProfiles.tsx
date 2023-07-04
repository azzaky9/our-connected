"use client";

import { Label } from "../ui/label";
import { Pict } from "./index";
import { Input } from "../ui/input";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { storage } from "@/firebase/config";
import Image from "next/image";
import { useUpload } from "@/hooks/useUpload";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type RegisteringAssetsType = {
  username: string;
  name: string;
  file: FileList;
};

interface FormSettingProfilesProps {
  isEdit: boolean;
}

const FormSettingProfiles: React.FC<FormSettingProfilesProps> = ({ isEdit }) => {
  const { uploadProfile } = useUpload();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisteringAssetsType>();

  const onSubmit = handleSubmit((data) => {
    const { file, name, username } = data;

    uploadProfile.mutate({ name: name, username: username, file: file });
  });

  if (!isEdit) {
    return (
      <div className='grid grid-cols-5'>
        <Pict />
        <div className='col-span-4'>
          <h5 className='text-sm'>Ucok Selalu Always</h5>
          <span className='text-gray-500'>@ucok</span>
        </div>
      </div>
    );
  }

  return (
    <form
      className='grid gap-4'
      onSubmit={onSubmit}>
      <Label className='grid grid-cols-4 place-content-center '>
        <Pict />
        <input
          type='file'
          className='col-span-3 custom_input-style text-zinc-700 active:text-white hover:cursor-pointer'
          placeholder='New Name'
          {...register("file", { required: true })}
        />
      </Label>
      <Label className='grid grid-cols-4 place-content-center'>
        <span className='pt-1 text-sm'>User Name</span>
        <input
          type='text'
          className='col-span-3 custom_input-style'
          placeholder='Set new User Name'
          {...register("username", { required: true })}
        />
      </Label>
      <Label className='grid grid-cols-4 place-content-center'>
        <span className='pt-1 text-sm'>Name</span>
        <input
          type='text'
          className='col-span-3 custom_input-style'
          placeholder='Set New Name'
          {...register("name", { required: true })}
        />
      </Label>
      <Button
        disabled={uploadProfile.isLoading && true}
        type='submit'>
        {uploadProfile.isLoading ? (
          <AiOutlineLoading3Quarters className='animate-spin' />
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
};

export default FormSettingProfiles;
