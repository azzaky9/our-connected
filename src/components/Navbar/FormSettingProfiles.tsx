'use client'

import React, { ChangeEvent, useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Pict } from './index'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { useUpload } from '@/hooks/index'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useAuth } from '@/context/AuthContext'
import { Input } from '../ui/input'
import profileSettingResolver from '../utils/form-resolver/resolver'
import CropDialog from './CropDialog'

export type RegisteringAssetsType = {
  username: string
  name: string
  file: FileList
}

interface FormSettingProfilesProps {
  onEdit: boolean
  closeEditModeHandler: () => void
}

const resolver = profileSettingResolver

const FormSettingProfiles: React.FC<FormSettingProfilesProps> = ({
  onEdit,
  closeEditModeHandler,
}) => {
  const { uploadProfile } = useUpload()
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
  } = useForm<RegisteringAssetsType>({ resolver })
  const [imgSrc, setImgSrc] = useState('')
  const [cropImg, setCropImg] = useState<File | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!onEdit) {
      return reset()
    }
  }, [onEdit, reset])

  const onSubmit = handleSubmit((data) => {
    const { mutate } = uploadProfile

    if (cropImg) {
      mutate({ ...data, file: cropImg, closeEditModeHandler, reset })
    }
  })

  const UnvalidMessage = ({ msg }: { msg?: string }) => (
    <span className='text-[0.7rem] text-red-700'>{msg}</span>
  )

  const showEditMode = onEdit ? 'grid' : 'hidden'

  return (
    <React.Fragment>
      <CropDialog
        src={imgSrc}
        setImgSrc={setImgSrc}
        setCropImg={setCropImg}
        resetField={resetField}
      />

      <form className='grid gap-4' onSubmit={onSubmit}>
        <div className='grid grid-cols-4'>
          <Pict size='medium' />

          {onEdit ? (
            <div className='col-span-3'>
              <Input
                type='file'
                className='input-styles'
                {...register('file', {
                  required: 'file must required',
                  onChange(e: ChangeEvent<HTMLInputElement>) {
                    if (e.target.files && e.target.files.length > 0) {
                      // setCrop(undefined) // Makes crop preview update between images.
                      const reader = new FileReader()
                      reader.addEventListener('load', () =>
                        setImgSrc(reader.result?.toString() || '')
                      )
                      reader.readAsDataURL(e.target.files[0])
                    }
                  },
                })}
              />
              {errors.file ? (
                <UnvalidMessage msg={errors.file.message} />
              ) : null}
            </div>
          ) : (
            <div className='col-span-3'>
              <h5>{user.name}</h5>
              <span className='text-gray-600 text-sm pt-2'>
                @{user.username}
              </span>
            </div>
          )}
        </div>
        <div className={showEditMode}>
          <Label className='pt-1 text-sm flex gap-1'>
            <span className='text-red-600'>*</span>username
          </Label>

          <Input
            type='text'
            className='input-styles'
            placeholder='new username'
            {...register('username', { required: 'username must be required' })}
          />
          {errors.username ? (
            <UnvalidMessage msg={errors.username?.message} />
          ) : null}
        </div>
        <div className={showEditMode}>
          <Label className='pt-1 text-sm flex gap-1'>
            <span className='text-red-600'>*</span>name
          </Label>

          <Input
            type='text'
            autoComplete='off'
            className='input-styles'
            placeholder='new name'
            {...register('name', { required: 'name must be required' })}
          />
          {errors.name ? <UnvalidMessage msg={errors.name.message} /> : null}
        </div>
        <Button
          disabled={uploadProfile.isLoading}
          className={showEditMode}
          type='submit'
        >
          {uploadProfile.isLoading ? (
            <AiOutlineLoading3Quarters className='animate-spin' />
          ) : (
            'Save changes'
          )}
        </Button>
      </form>
    </React.Fragment>
  )
}

export default FormSettingProfiles
