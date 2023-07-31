import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import Link from 'next/link'
import CreateNewUserForm from '@/components/form/CreateNewUser'

const SignupScreen = () => {
  return (
    <React.Fragment>
      <aside className='xl:flex flex-col col-span-3 gap-5 justify-center ml-40 hidden'>
        <h1 className='text-[5rem] text-semibold text-white font-semibold'>
          Sign Up now!
        </h1>
        <p className='text-zinc-700 text-lg w-3/4'>
          Signing up has never been easier! We value your time and want you to
          have a hassle-free experience from the get-go. Our streamlined
          registration process ensures youre just moments away from joining our
          community.
        </p>
      </aside>

      <div className='grid place-content-center col-span-2'>
        <Card className='max-w-[380px] w-full relative lg:right-40 max-[400px]:border-none'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl'>Create an account</CardTitle>
            <CardDescription>essiest register email & password</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateNewUserForm />
          </CardContent>
          <CardFooter>
            <Link href='./signin' className='text-zinc-600 text-sm'>
              if you already have account, you can login in{' '}
              <span className='text-blue-600'>here</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </React.Fragment>
  )
}

export default SignupScreen
