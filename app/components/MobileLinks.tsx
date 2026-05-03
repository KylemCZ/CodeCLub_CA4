'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Technology } from "@/app/lib/definitions";

export default function MobileLinks({ closeMenu, technologies }: { closeMenu: () => void, technologies: Technology[] }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col min-h-screen items-center py-8 space-y-6">
      <span>
        <Link href="/technologies" onClick={closeMenu} className={clsx(
          'text-blue-400',
            {
            'text-gray-600': pathname === '/technologies',
            },
          )}>
        Home</Link>
        <hr className={clsx(
          'border-t-4 border-blue-400 mt-2',
            {
            'border-gray-600': pathname === '/technologies',
            },
          )}/>
      </span>
      {technologies.map((tech) => (
        <span key={tech.id}>
          <Link href={`/technologies/${tech.id}`} onClick={closeMenu} className={clsx(
            'text-emerald-400',
              {
              'text-gray-600': pathname === `/technologies/${tech.id}`,
              },
            )}>
          {tech.id}</Link>
          <hr className={clsx(
              'border-t-4 border-emerald-400 mt-2',
                {
                'border-gray-600': pathname === `/technologies/${tech.id}`,
                },
            )}/>
        </span>
      ))}
    </nav>
  );
}
