/*
 * validating input resolver variable
 * make it more structured and clean for
 * validating any value @react-hook-form lib
 */

import { RegisteringAssetsType } from '@/components/Navbar/FormSettingProfiles'
import { Resolver, FieldError } from 'react-hook-form'

interface ErrorMessages {
  file?: FieldError
  name?: FieldError
  username?: FieldError
}

// Profile setting resolver
const profileSettingResolver: Resolver<RegisteringAssetsType> = async (
  data
) => {
  const nameValid = /^[a-z\s]+$/i.test(data.name)
  const usernameValid = /^[a-z0-9_-]+$/i.test(data.username)
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
  } else if (nameValid && data.name.length < 5) {
    errors.name = { type: 'onChange', message: 'to short for name' }
  }

  if (!usernameValid) {
    errors.username = {
      type: 'onChange',
      message: 'Username only accepts lowercase letters.',
    }
  } else if (nameValid && data.username.length <= 2) {
    errors.username = { type: 'onChange', message: 'to short for username' }
  }

  return { values: data, errors }
}

export default profileSettingResolver
