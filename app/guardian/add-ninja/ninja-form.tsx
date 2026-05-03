'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { addNinja } from '@/app/action/users'

const AVATARS = [
  '/ninja1.svg',
  '/ninja2.svg',
  '/ninja3.svg',
  '/ninja4.svg',
  '/ninja5.svg',
]

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return <p className="text-red-400 text-xs mt-1">{errors[0]}</p>
}

export default function NinjaForm() {
  const [state, action, pending] = useActionState(addNinja, undefined)
  const [selectedAvatar, setSelectedAvatar] = useState<string>('')

  return (
    <form action={action} className="bg-cyan-950 rounded-2xl border-4 border-emerald-400 p-8 space-y-6">

      {state?.message && (
        <p className="text-red-400 text-sm font-medium">{state.message}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-emerald-400 font-semibold text-sm">Name</label>
          <input
            name="name"
            type="text"
            className="bg-gray-800 text-white rounded-lg border border-gray-600 px-4 py-3 focus:outline-none focus:border-emerald-500"
          />
          <FieldError errors={state?.errors?.name} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-emerald-400 font-semibold text-sm">Username</label>
          <input
            name="username"
            type="text"
            className="bg-gray-800 text-white rounded-lg border border-gray-600 px-4 py-3 focus:outline-none focus:border-emerald-500"
          />
          <FieldError errors={state?.errors?.username} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-emerald-400 font-semibold text-sm">Password</label>
          <input
            name="password"
            type="password"
            className="bg-gray-800 text-white rounded-lg border border-gray-600 px-4 py-3 focus:outline-none focus:border-emerald-500"
          />
          <FieldError errors={state?.errors?.password} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-emerald-400 font-semibold text-sm">Date of Birth</label>
          <input
            name="dob"
            type="date"
            className="bg-gray-800 text-white rounded-lg border border-gray-600 px-4 py-3 focus:outline-none focus:border-emerald-500"
          />
          <FieldError errors={state?.errors?.dob} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-emerald-400 font-semibold text-sm">Gender</label>
          <select
            name="gender"
            defaultValue=""
            className="bg-gray-800 text-white rounded-lg border border-gray-600 px-4 py-3 focus:outline-none focus:border-emerald-500"
          >
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <FieldError errors={state?.errors?.gender} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-emerald-400 font-semibold text-sm">Choose Avatar</label>
        <div className="flex gap-4 flex-wrap">
          {AVATARS.map((src) => (
            <label key={src} className="cursor-pointer">
              <input
                type="radio"
                name="image"
                value={src}
                checked={selectedAvatar === src}
                onChange={() => setSelectedAvatar(src)}
                className="sr-only"
              />
              <div className={`relative w-20 h-20 rounded-xl overflow-hidden border-4 transition-colors ${
                selectedAvatar === src ? 'border-emerald-400' : 'border-transparent'
              }`}>
                <Image src={src} fill className="object-cover" alt={src} />
              </div>
            </label>
          ))}
        </div>
        <FieldError errors={state?.errors?.image} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-lg bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 transition disabled:opacity-50"
      >
        {pending ? 'Adding…' : 'Add Ninja'}
      </button>
    </form>
  )
}
