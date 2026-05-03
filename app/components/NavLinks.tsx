'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Technology } from "@/app/lib/definitions";

export default function NavLinks({ technologies }: { technologies: Technology[] }) {
  const pathname = usePathname();
  return (
    <nav className="hidden md:block space-x-6 lg:w-36 lg:space-y-6 lg:flex lg:flex-col lg:space-x-0 lg:mx-auto text-xl font-bold" aria-label="main">
      <Link href="/technologies" className={clsx(
        'rounded-md p-2 lg:text-center bg-blue-600 border-b-4 border-blue-800 transition-all hover:bg-blue-500 hover:border-blue-700 hover:text-gray-700 duration-300 ease-out active:translate-y-0.5 active:border-b-0.5',
          {
          'bg-gray-600 text-gray-300 border-gray-800': pathname === '/technologies',
          },
        )}>
      Home</Link>
      {technologies.map((tech) => (
      <Link key={tech.id} href={`/technologies/${tech.id}`} className={clsx(
        'truncate rounded-md p-2 lg:text-center bg-emerald-600 border-b-4 border-emerald-800 hover:bg-emerald-400 hover:border-emerald-600 hover:text-gray-700 duration-300 ease-out active:translate-y-0.5 active:border-b-0.5',
          {
          'bg-gray-600 text-gray-300 border-gray-800': pathname === `/technologies/${tech.id}`,
          },
        )}>
      {tech.id}</Link>
        ))}
    </nav>
  );
}
