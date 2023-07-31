'use client'

import React, { memo, useState, useEffect } from 'react'
import { FieldError, Resolver, useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import useFirebaseAuth from '@/hooks/useFirebaseAuth'
import { AtSign, Lock, User2, Loader } from 'lucide-react'
import { type LoginValuesInput } from './LoginForm'
import GoogleButton from '../Actionbutton/GoogleButton'
import PasswordInputs from '../form/PasswordInputs'

interface ErrorMessage {
  email?: FieldError
  password?: FieldError
}

const resolver: Resolver<LoginValuesInput> = (data) => {
  const errors: ErrorMessage = {}
  const paswordRegExp =
    /^(?=.{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/g
  const nameRegExp = /^[a-zA-Z ]+$/i
  const usernameRegExp = /^[a-z0-9_-]+$/i

  if (!data.email) {
    errors.email = { type: 'required', message: 'email is required' }
  } else if (data.email && !data.email.toLowerCase().includes('@')) {
    errors.email = {
      type: 'onChange',
      message: 'Please filled with valid email',
    }
  }

  if (!data.password) {
    errors.email = { type: 'required', message: 'password is required' }
  } else if (data.password && !data.password?.match(paswordRegExp)) {
    errors.password = {
      type: 'onChange',
      message:
        'Password must contain at least 8 characters, one symbol, one uppercase letter, and one number.',
    }
  }

  return {
    values: data,
    errors,
  }
}

const DisplayErrorMessage = memo(function DisplayErrorMessage({
  message,
}: {
  message: string | undefined
}) {
  return (
    <React.Fragment>
      {message && <span className='text-red-500 text-[0.8rem]'>{message}</span>}
    </React.Fragment>
  )
})

const CreateNewUserForm = () => {
  const [emailUser, setEmailUser] = useState('')
  const { createNewUser, errorAuthMessage, isAuthError } = useFirebaseAuth()
  const { isLoading, isSuccess, isError } = createNewUser

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValuesInput>({ resolver })

  const onSubmit = handleSubmit((values) => {
    setEmailUser(values.email)

    createNewUser.mutate(values)
  })

  return (
    <React.Fragment>
      <form onSubmit={onSubmit} className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            {...register('email')}
            id='email'
            type='email'
            placeholder='our-connected@connect.com'
            autoComplete='off'
            className='input-styles'
          />
          <DisplayErrorMessage
            message={isAuthError ? errorAuthMessage : errors.email?.message}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <PasswordInputs
            {...register('password')}
            theme='light'
            id='password'
            autoComplete='off'
            className='input-styles'
          />
          <DisplayErrorMessage message={errors.password?.message} />
        </div>
        <Button
          disabled={isLoading}
          type='submit'
          className='w-full bg-white text-black hover:bg-gray-200 '
        >
          {isLoading ? <Loader className='animate-spin' /> : 'Create account'}
        </Button>
      </form>
      <div className='relative my-5'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-zinc-800' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-slate-950 px-2 text-slate-50'>
            Or continue with
          </span>
        </div>
      </div>

      <GoogleButton />
    </React.Fragment>
  )
}

export default CreateNewUserForm
