'use client'

import { Label } from '../ui/label'
import { Pict } from './index'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { useUpload } from '@/hooks/index'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { Resolver, FieldError } from 'react-hook-form'
import { Input } from '../ui/input'

export type RegisteringAssetsType = {
  username: string
  name: string
  file: File[]
}

interface ErrorMessages {
  file?: FieldError
  name?: FieldError
  username?: FieldError
}

interface FormSettingProfilesProps {
  onEdit: boolean
  closeEditModeHandler: () => void
}

// validate name not contain symbol and number
const resolver: Resolver<RegisteringAssetsType> = async (data) => {
  const nameValid = /^[a-z\s]+$/i.test(data.name)
  const usernameValid = /^[a-z]+$/i.test(data.username)
  const fileExtension = data.file[0]?.name.split('.').pop()?.toLowerCase()
  const errors: ErrorMessages = {}

  if (!data.file[0]) {
    errors.file = { type: 'onChange', message: 'Please select a file.' }
  } else if (!['webp', 'jpeg', 'jpg', 'png'].includes(fileExtension || '')) {
    errors.file = {
      type: 'onChange',
      message:
        'Invalid file type. Please upload a file with the specified format. Only accept jpg, jpeg, png, and webp formats.',
    }
  }

  if (!nameValid) {
    errors.name = {
      type: 'onChange',
      message: 'Name should not contain symbols or numbers.',
    }
  }

  if (!usernameValid) {
    errors.username = {
      type: 'onChange',
      message: 'Username only accepts lowercase letters.',
    }
  }

  return { values: data, errors }
}

const FormSettingProfiles: React.FC<FormSettingProfilesProps> = ({
  onEdit,
  closeEditModeHandler,
}) => {
  const { uploadProfile } = useUpload()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisteringAssetsType>({ resolver })

  const { user } = useAuth()

  useEffect(() => {
    if (!onEdit) {
      return reset()
    }
  }, [onEdit, reset])

  const onSubmit = handleSubmit((data) => {
    const { mutate } = uploadProfile

    mutate({ ...data, closeEditModeHandler, reset })
  })

  const ErrMessage = ({ msg }: { msg?: string }) => (
    <li className='text-[0.7rem] text-red-700 list-disc'>{msg}</li>
  )

  const showEditMode = onEdit ? 'grid' : 'hidden'

  return (
    <form className='grid gap-4' onSubmit={onSubmit}>
      <div className='grid grid-cols-4'>
        <Pict size='medium' />
        {onEdit ? (
          <Input
            type='file'
            className='col-span-3 input-styles'
            {...register('file', { required: 'file must required' })}
          />
        ) : (
          <div className='col-span-3'>
            <h5>{user.name}</h5>
            <span className='text-gray-600 text-sm pt-2'>@{user.username}</span>
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
      <ul>
        {errors.file && <ErrMessage msg={errors.file.message} />}
        {errors.name && <ErrMessage msg={errors.name.message} />}
        {errors.username && <ErrMessage msg={errors.username?.message} />}
      </ul>
    </form>
  )
}

export default FormSettingProfiles
