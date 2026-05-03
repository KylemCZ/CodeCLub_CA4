'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setUserRole, toggleUserActive } from '@/app/action/users'

type User = {
  id: string
  name: string
  email: string | null
  username: string | null
  role: string
  isActive: boolean
  isSelf: boolean
}

function RoleSelect({ user, rolePending, onRoleChange }: { user: User; rolePending: boolean; onRoleChange: (r: string) => void }) {
  if (user.isSelf) return <span className="text-emerald-400 capitalize font-semibold">{user.role}</span>
  return (
    <select
      value={user.role}
      disabled={rolePending}
      onChange={(e) => onRoleChange(e.target.value)}
      className="bg-gray-700 text-white text-sm rounded border border-gray-600 px-2 py-1 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
    >
      <option value="ninja">Ninja</option>
      <option value="coder">Coder</option>
      <option value="guardian">Guardian</option>
      <option value="admin">Admin</option>
    </select>
  )
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>
      {isActive ? 'Active' : 'Disabled'}
    </span>
  )
}

function ToggleButton({ user, pending, onToggle }: { user: User; pending: boolean; onToggle: () => void }) {
  if (user.isSelf) return null
  return (
    <button
      onClick={onToggle}
      disabled={pending}
      className={`text-sm px-3 py-1 rounded font-semibold transition duration-200 disabled:opacity-50 ${
        user.isActive ? 'bg-red-800 hover:bg-red-700 text-red-200' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-200'
      }`}
    >
      {pending ? '...' : user.isActive ? 'Disable' : 'Activate'}
    </button>
  )
}

function UserCard({ user }: { user: User }) {
  const router = useRouter()
  const [rolePending, startRoleTransition] = useTransition()
  const [activePending, startActiveTransition] = useTransition()

  function handleRoleChange(role: string) {
    startRoleTransition(async () => { await setUserRole(user.id, role); router.refresh() })
  }
  function handleToggleActive() {
    startActiveTransition(async () => { await toggleUserActive(user.id, user.isActive); router.refresh() })
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-white font-semibold truncate">{user.name}</p>
          <p className="text-gray-400 text-sm truncate">{user.role === 'ninja' ? user.username : user.email}</p>
        </div>
        <StatusBadge isActive={user.isActive} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <RoleSelect user={user} rolePending={rolePending} onRoleChange={handleRoleChange} />
        <ToggleButton user={user} pending={activePending} onToggle={handleToggleActive} />
      </div>
    </div>
  )
}

function UserRow({ user }: { user: User }) {
  const router = useRouter()
  const [rolePending, startRoleTransition] = useTransition()
  const [activePending, startActiveTransition] = useTransition()

  function handleRoleChange(role: string) {
    startRoleTransition(async () => { await setUserRole(user.id, role); router.refresh() })
  }
  function handleToggleActive() {
    startActiveTransition(async () => { await toggleUserActive(user.id, user.isActive); router.refresh() })
  }

  return (
    <tr className="border-t border-gray-700">
      <td className="py-3 px-4 text-white">{user.name}</td>
      <td className="py-3 px-4 text-gray-400 text-sm">{user.role === 'ninja' ? user.username : user.email}</td>
      <td className="py-3 px-4">
        <RoleSelect user={user} rolePending={rolePending} onRoleChange={handleRoleChange} />
      </td>
      <td className="py-3 px-4">
        <StatusBadge isActive={user.isActive} />
      </td>
      <td className="py-3 px-4">
        <ToggleButton user={user} pending={activePending} onToggle={handleToggleActive} />
      </td>
    </tr>
  )
}

export default function UsersTable({ users }: { users: User[] }) {
  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-sm uppercase tracking-wide">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email / Username</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
