import React from 'react'
import Link from 'next/link'
import LoginForm from '@/components/form/LoginForm'
import AnimateType from '@/components/AnimateTyping'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'

const SigninScreen = () => {
  return (
    <React.Fragment>
      <div className='grid place-content-center col-span-2'>
        <Card className='max-w-[380px] w-full max-[400px]:border-none'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl'>Sign In</CardTitle>
            <CardDescription>
              Enter your email below to access this app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter>
            <Link href='./signup' className=' text-zinc-600 text-sm'>
              Not already have account? you can sign up here{' '}
              <span className='text-blue-600'>here</span>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <aside className='xl:flex flex-col col-span-3 justify-center font-semibold text-white hidden'>
        <AnimateType />
      </aside>
    </React.Fragment>
  )
}

export default SigninScreen
