import './globals.css'
import { Poppins } from 'next/font/google'
import Providers from './utils/Providers'
import { Toaster } from '@/components/ui/toastutils/toaster'
import { AuthProvider } from '@/context/AuthContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import Scrolltop from '@/components/Scrolltop'

const inter = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

export const metadata = {
  title: 'Welcome To Our Connected',
  description: 'Stay up to date, and keep you conversatio with your friends !',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} min-h-screen h-fit bg-gradient-to-br  from-zinc-900 to-slate-950 `}
      >
        <Providers>
          <AuthProvider>
            <TooltipProvider>
              <Scrolltop />
              {children}
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
