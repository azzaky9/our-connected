"use client";

import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { ButtonHTMLAttributes } from "react";
import { GoPencil } from "react-icons/go";
import { useAuth } from "@/context/AuthContext";
import { FormSettingProfiles } from "./index";
import { useForm, Resolver } from "react-hook-form";

type TResolverParams = {
  file: File;
};

export const ProfileSettings = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TResolverParams>();

  const onSubmit = handleSubmit(({ file }) => {
    if (!errors) console.log(file);
  });

  const handleEdit = () => setIsEdit(!isEdit);

  return (
    <Sheet>
      {children}
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle className='text-slate-50'>{isEdit ? "Edit Profile" : "Profile"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Make changes to your profile here. Click save when youre done." : null}
          </SheetDescription>
        </SheetHeader>
        <div className='py-4'>
          <FormSettingProfiles isEdit={isEdit} />
        </div>
        <SheetFooter>
          <div className='flex gap-2'>
            <Button
              type='submit'
              onClick={onSubmit}>
              Save changes
            </Button>
            <EditButtons onClick={handleEdit}>{!isEdit ? "Edit" : "Undo"}</EditButtons>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

interface TPropsEditButtons extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const EditButtons: React.FC<TPropsEditButtons> = ({ children, ...rest }) => {
  return (
    <Button
      variant='outline'
      className='flex gap-2 hover:bg-opacity-50 hover:bg-slate-900 hover:text-white bg-slate-900 bg-opacity-5 border-gray-800'
      {...rest}>
      {children} <GoPencil />
    </Button>
  );
};

export default ProfileSettings;
