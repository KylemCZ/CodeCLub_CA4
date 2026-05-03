'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleTechActive } from '@/app/action/import'
import { Technology } from '@/app/lib/definitions'

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>
      {isActive ? 'Active' : 'Disabled'}
    </span>
  )
}

function ToggleButton({ tech, pending, onToggle }: { tech: Technology; pending: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      disabled={pending}
      className={`text-sm px-3 py-1 rounded font-semibold transition duration-200 disabled:opacity-50 ${
        tech.isActive
          ? 'bg-red-800 hover:bg-red-700 text-red-200'
          : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-200'
      }`}
    >
      {pending ? '...' : tech.isActive ? 'Disable' : 'Activate'}
    </button>
  )
}

function TechCard({ tech }: { tech: Technology }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => { await toggleTechActive(tech.id, tech.isActive); router.refresh() })
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
      <div className="flex items-start justify-between gap-2">
        <p className="text-white font-semibold">{tech.id}</p>
        <StatusBadge isActive={tech.isActive} />
      </div>
      <p className="text-gray-400 text-sm line-clamp-2">{tech.description}</p>
      <div className="flex justify-end">
        <ToggleButton tech={tech} pending={pending} onToggle={handleToggle} />
      </div>
    </div>
  )
}

function TechRow({ tech }: { tech: Technology }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => { await toggleTechActive(tech.id, tech.isActive); router.refresh() })
  }

  return (
    <tr className="border-t border-gray-700">
      <td className="py-3 px-4 text-white">{tech.id}</td>
      <td className="py-3 px-4 text-gray-400 text-sm">{tech.description}</td>
      <td className="py-3 px-4"><StatusBadge isActive={tech.isActive} /></td>
      <td className="py-3 px-4">
        <ToggleButton tech={tech} pending={pending} onToggle={handleToggle} />
      </td>
    </tr>
  )
}

export default function TechnologiesTable({ technologies }: { technologies: Technology[] }) {
  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {technologies.map((tech) => (
          <TechCard key={tech.id} tech={tech} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-sm uppercase tracking-wide">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {technologies.map((tech) => (
              <TechRow key={tech.id} tech={tech} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
