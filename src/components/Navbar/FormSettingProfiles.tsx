"use client";

import { Label } from "../ui/label";
import { Pict } from "./index";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useUpload } from "@/hooks/useUpload";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";

export type RegisteringAssetsType = {
  username: string;
  name: string;
  file?: FileList;
};

interface FormSettingProfilesProps {
  onEdit: boolean;
  closeEditModeHandler: () => void;
}

const FormSettingProfiles: React.FC<FormSettingProfilesProps> = ({
  onEdit,
  closeEditModeHandler
}) => {
  const { uploadProfile } = useUpload();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RegisteringAssetsType>();
  const { user } = useAuth();

  const onSubmit = handleSubmit((data) => {
    const { file, name, username } = data;
    const { mutateAsync } = uploadProfile;

    mutateAsync({ file: file, username: username, name: name }).then(() => {
      reset();
      closeEditModeHandler();
    });
  });

  return (
    <form
      className='grid gap-4'
      onSubmit={onSubmit}>
      <Label className='grid grid-cols-4 place-content-center '>
        <Pict size='medium' />
        {!onEdit ? (
          <div className='col-span-3 mt-4'>
            <h5>{user.name}</h5>
            <span className='text-gray-600 text-sm pt-2'>@{user.username}</span>
          </div>
        ) : (
          <input
            type='file'
            className='col-span-3 custom_input-style text-zinc-700 active:text-white hover:cursor-pointer'
            placeholder='New Name'
            {...register("file", { required: true })}
          />
        )}
      </Label>
      <Label className={`${onEdit ? "grid" : "hidden"} grid-cols-4 place-content-center`}>
        <span className='pt-1 text-sm'>User Name</span>
        <input
          type='text'
          className='col-span-3 custom_input-style'
          placeholder='Set new User Name'
          {...register("username", { required: true })}
        />
      </Label>
      <Label className={`${onEdit ? "grid" : "hidden"} grid-cols-4 place-content-center`}>
        <span className='pt-1 text-sm'>Name</span>
        <input
          type='text'
          className='col-span-3 custom_input-style'
          placeholder='Set New Name'
          {...register("name", { required: true })}
        />
      </Label>
      <Button
        disabled={uploadProfile.isLoading}
        type='submit'
        className={`${onEdit ? "grid" : "hidden"}`}>
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
