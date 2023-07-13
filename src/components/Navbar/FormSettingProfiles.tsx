"use client";

import { Label } from "../ui/label";
import { Pict } from "./index";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useUpload } from "@/hooks/useUpload";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Resolver, FieldError } from "react-hook-form";
import useCustomToast from "@/hooks/useCustomToast";

export type RegisteringAssetsType = {
  username: string;
  name: string;
  file: File[];
};

interface ErrorMessages {
  file?: FieldError;
  name?: FieldError;
  username?: FieldError;
}

interface FormSettingProfilesProps {
  onEdit: boolean;
  closeEditModeHandler: () => void;
}

// validate name not contain symbol and number
const resolver: Resolver<RegisteringAssetsType> = async (data) => {
  const nameValid = /^[a-z\s]+$/i.test(data.name);
  const usernameValid = /^[a-z]+$/i.test(data.username);
  const fileExtension = data.file[0]?.name.split(".").pop()?.toLowerCase();
  const errors: ErrorMessages = {};

  if (!data.file[0]) {
    errors.file = { type: "onChange", message: "Please select a file." };
  } else if (!["webp", "jpeg", "jpg", "png"].includes(fileExtension || "")) {
    errors.file = {
      type: "onChange",
      message:
        "Invalid file type. Please upload a file with the specified format. Only accept jpg, jpeg, png, and webp formats."
    };
  }

  if (!nameValid) {
    errors.name = {
      type: "onChange",
      message: "Name should not contain symbols or numbers."
    };
  }

  if (!usernameValid) {
    errors.username = {
      type: "onChange",
      message: "Username only accepts lowercase letters."
    };
  }

  return { values: data, errors };
};

const FormSettingProfiles: React.FC<FormSettingProfilesProps> = ({
  onEdit,
  closeEditModeHandler
}) => {
  const { generateToast } = useCustomToast();
  const { uploadProfile, checkUsernameAvailability } = useUpload();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisteringAssetsType>({ resolver });

  const { user } = useAuth();

  useEffect(() => {
    if (!onEdit) {
      return reset();
    }
  }, [onEdit, reset]);

  const onSubmit = handleSubmit((data) => {
    const { file, name, username } = data;
    const { mutateAsync } = uploadProfile;

    checkUsernameAvailability(username)
      .then((isUsernameAvalable) => {
        if (isUsernameAvalable) {
          mutateAsync({ file: file, username: username, name: name })
            .then(() => {
              reset();
              closeEditModeHandler();
            })
            .then(() => generateToast({ message: "Successfully Upload", variant: "success" }));
        } else {
          generateToast({
            message: "Failed",
            description: "username already taken",
            variant: "error"
          });
        }
      })
      .catch((err) => console.error(err));
  });

  const ErrMessage = ({ msg }: { msg?: string }) => (
    <li className='text-[0.7rem] text-red-700 list-disc'>{msg}</li>
  );

  return (
    <form
      className='grid gap-4'
      onSubmit={onSubmit}>
      <Label className='grid grid-cols-4 place-content-center'>
        <Pict size='medium' />
        {!onEdit ? (
          <div className='col-span-3 mt-3'>
            <h5>{user.name}</h5>
            <span className='text-gray-600 text-sm pt-2'>@{user.username}</span>
          </div>
        ) : (
          <input
            type='file'
            className='col-span-3 custom_input-style text-zinc-700 active:text-white hover:cursor-pointer'
            placeholder='New Name'
            accept=''
            {...register("file", { required: "file must required" })}
          />
        )}
      </Label>
      <Label className={`${onEdit ? "grid" : "hidden"} grid-cols-4 place-content-center`}>
        <span className='pt-1 text-sm'>User Name</span>
        <input
          type='text'
          className='col-span-3 custom_input-style'
          placeholder='Set new User Name'
          {...register("username", { required: "username must be required" })}
        />
      </Label>
      <Label className={`${onEdit ? "grid" : "hidden"} grid-cols-4 place-content-center`}>
        <span className='pt-1 text-sm'>Name</span>
        <input
          type='text'
          className='col-span-3 custom_input-style'
          placeholder='Set New Name'
          {...register("name", { required: "name must be required" })}
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
      <ul>
        {errors.file && <ErrMessage msg={errors.file.message} />}
        {errors.name && <ErrMessage msg={errors.name.message} />}
        {errors.username && <ErrMessage msg={errors.username?.message} />}
      </ul>
    </form>
  );
};

export default FormSettingProfiles;
