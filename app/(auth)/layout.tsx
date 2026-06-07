import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Login - Lombok Transfer Internal Dashboard',
  description: 'Login to Lombok Transfer Internal Dashboard',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center flex flex-col items-center">
          <div className="w-24 h-24 relative mb-4 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
            <Image 
              src="/logo.png" 
              alt="Lombok Transfer Logo" 
              fill
              className="object-cover"
              priority
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Lombok Transfer
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Internal Dashboard
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
