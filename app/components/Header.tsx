"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";
import MobileLinks from "./MobileLinks";
import { Technology } from "@/app/lib/definitions";
import { logout } from "@/app/action/auth";

type User = { id: string; name: string; role: string; image: string | null } | null;

export default function Header({ technologies, user }: { technologies: Technology[]; user: User }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="lg:fixed lg:h-screen lg:left-0 lg:top-0 flex top-0 sticky z-1 bg-cyan-900 border-y-8 lg:border-0 lg:border-r-4 border-solid border-emerald-400">
      <div className="w-full m-2.5 flex gap-4 items-center justify-between lg:flex-col lg:justify-start lg:h-full">
        <Link href="/technologies">
          <Image
            src="/code_club_logo.svg"
            width={50}
            height={50}
            className="rounded-full border-solid border-3 border-emerald-600"
            alt="Code club logo"
          />
        </Link>
        <button
          onClick={toggleMenu}
          className="text-3xl md:hidden"
          aria-label="Open menu"
        >
          &#9776;
        </button>
        <NavLinks technologies={technologies} />
        <div className="hidden lg:flex flex-col items-center gap-4 lg:mt-auto lg:mb-10 w-full">
          <div className="w-3/4 h-px bg-emerald-400 opacity-40"></div>
         <Image
            src={user?.image ?? "/user_icon.svg"}
            width={80}
            height={80}
            className="rounded-full border-3 border-emerald-400 w-20 h-20"
            alt="User icon"
          />
          <div className="flex flex-col gap-3 w-3/4">
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="text-center first-letter:capitalize text-white font-semibold truncate hover:text-amber-400">
                  {user.name}
                </Link>
                <p className="text-center text-emerald-400 text-xs capitalize tracking-wide">{user.role}</p>
                <form action={logout}>
                  <button type="submit" className="flex items-center justify-center w-full py-2 rounded-lg border border-emerald-400 text-emerald-300 font-semibold hover:bg-emerald-400 hover:text-gray-700 cursor-pointer">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/signup" className="flex items-center justify-center w-full py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 hover:text-gray-300">
                  Sign Up
                </Link>
                <Link href="/login" className="flex items-center justify-center w-full py-2 rounded-lg border border-emerald-400 text-emerald-300 font-semibold hover:bg-emerald-400 hover:text-gray-700">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <section
        className={`absolute top-0 bg-gray-950 w-full h-screen overflow-y-auto text-5xl flex-col origin-top
        ${menuOpen ? "flex animate-open-menu" : "hidden"}`}
      >
        <button
          onClick={closeMenu}
          className="text-7xl self-end px-6"
          aria-label="Close menu"
        >
          &times;
        </button>
        <div className="flex flex-col items-center gap-4 w-full px-8 pb-4">
          <div className="w-full h-px bg-emerald-400 opacity-40"></div>
          <Image
            src={user?.image ?? "/user_icon.svg"}
            width={72}
            height={72}
            className="rounded-full border-3 border-emerald-400 w-18 h-18"
            alt="User icon"
          />
          {user ? (
            <div className="flex flex-col gap-3 w-full">
              <Link
                href={user.role === 'admin' ? '/admin' : '/profile'}
                onClick={closeMenu}
                className="text-center text-xl text-white font-semibold truncate hover:text-amber-400"
              >
                {user.name}
              </Link>
              <p className="text-center text-emerald-400 text-sm capitalize tracking-wide">{user.role}</p>
              <form action={logout}>
                <button type="submit" className="flex items-center justify-center w-full py-3 rounded-lg border border-emerald-400 text-emerald-300 text-lg font-semibold hover:bg-emerald-400 hover:text-gray-700 cursor-pointer">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              <Link href="/signup" onClick={closeMenu} className="flex items-center justify-center w-full py-3 rounded-lg bg-emerald-500 text-white text-lg font-semibold hover:bg-emerald-600">
                Sign Up
              </Link>
              <Link href="/login" onClick={closeMenu} className="flex items-center justify-center w-full py-3 rounded-lg border border-emerald-400 text-emerald-300 text-lg font-semibold hover:bg-emerald-400 hover:text-gray-700">
                Login
              </Link>
            </div>
          )}
        </div>
        <MobileLinks closeMenu={closeMenu} technologies={technologies} />
      </section>
    </header>
  );
}