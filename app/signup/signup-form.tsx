'use client'
 
import { signup } from '@/app/action/auth'
import { useActionState } from 'react'
import Link from 'next/link'
 
export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)
 
  return (
    <form action={action} className="space-y-6 bg-gray-800 p-8 rounded-lg">
      <div>
        <label htmlFor="name" className="block text-white font-semibold mb-2">Name<span className="text-red-500">*</span></label>
        <input id="name" name="name" placeholder="Name" type="text" className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"/>
      </div>
      {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
 
      <div>
        <label htmlFor="email" className="block text-white font-semibold mb-2">Email<span className="text-red-500">*</span></label>
        <input id="email" name="email" placeholder="Email" type="email" className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"/>
      </div>
      {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
 
      <div>
        <label htmlFor="password" className="block text-white font-semibold mb-2">Password<span className="text-red-500">*</span></label>
        <input id="password" name="password" type="password" className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"/>
      </div>
      {state?.errors?.password && (
        <div>
          <p className="text-red-500 text-sm">Password must:</p>
          <ul className="text-red-500 text-sm">
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <label htmlFor="dob" className="block text-white font-semibold mb-2">Date of Birth<span className="text-red-500">*</span></label>
        <input id="dob" name="dob" type="date" className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"/>
      </div>
      {state?.errors?.dob && <p className="text-red-500 text-sm">{state.errors.dob}</p>}

      <div>
        <label htmlFor="gender" className="block text-white font-semibold mb-2">Gender<span className="text-red-500">*</span></label>
        <select id="gender" name="gender" defaultValue="" className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500">
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      {state?.errors?.gender && <p className="text-red-500 text-sm">{state.errors.gender}</p>}

      <div>
        <label htmlFor="image" className="block text-white font-semibold mb-2">Avatar URL</label>
        <input id="image" name="image" placeholder="https://..." type="url" className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"/>
      </div>

      <div className="flex items-center gap-3">
        <input id="isParent" name="isParent" type="checkbox" className="w-4 h-4 accent-emerald-500 cursor-pointer"/>
        <label htmlFor="isParent" className="text-white font-semibold cursor-pointer">I am a parent / guardian</label>
      </div>

      <button disabled={pending} type="submit" className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition duration-200 cursor-pointer">
        {pending ? 'Signing up...' : 'Sign Up'}
      </button>
      <Link href="/login" className="flex items-center justify-center w-full py-2 rounded-lg border border-gray-500 text-gray-400 hover:border-emerald-400 hover:text-emerald-300 transition duration-200">
        Already have an account? Log in
      </Link>
    </form>
  )
}