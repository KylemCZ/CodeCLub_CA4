'use client'
 
import { login } from '@/app/action/auth'
import { useActionState } from 'react'
import Link from 'next/link'
 
export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
 
  return (
    <form action={action} className="space-y-6 bg-gray-800 p-8 rounded-lg">
      <div>
        <label htmlFor="email" className="block text-white font-semibold mb-2">Email</label>
        <input id="email" name="email" placeholder="Email" className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
        {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
      </div>
 
      <div>
        <label htmlFor="password" className="block text-white font-semibold mb-2">Password</label>
        <input id="password" name="password" type="password" className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
        {state?.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        )}
      </div>
      {state?.message && (
        <p className="p-2 bg-red-100 text-red-700 rounded-md border border-red-200">
          {state.message}
        </p>
      )}
 
      <button
        disabled={pending}  type="submit" className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition duration-200 cursor-pointer"
      >
        {pending ? 'Logging in...' : 'Login'}
      </button>
      <Link href="/signup" className="flex items-center justify-center w-full py-2 rounded-lg border border-gray-500 text-gray-400 hover:border-emerald-400 hover:text-emerald-300 transition duration-200">
        Don't have an account? Sign up
      </Link>
      <Link href="/login/ninja" className="flex items-center justify-center w-full py-2 rounded-lg border border-gray-500 text-gray-400 hover:border-purple-400 hover:text-purple-300 transition duration-200">
        Login as Ninja
      </Link>
    </form>
  )
}