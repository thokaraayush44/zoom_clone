import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import MobileNav from './MobileNav'
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between fixed top-0 z-50 w-full bg-dark-1 px-6 py-4 lg:px-10'>
      <Link href="/" className='flex items-center gap-1'>
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="Stream logo"
          className='max-sm:size-10'       
        />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">StreamMeet</p>
      </Link>
      <div className="flex item-center gap-5">

        <Show when="signed-out">

          <SignInButton mode="redirect">
            <button className="whitespace-nowrap text-white px-4 py-2 hover:text-purple-400 transition">
              Sign In
            </button>
          </SignInButton>


          <SignUpButton mode="redirect">
            <button className="whitespace-nowrap rounded bg-purple-600 px-5 py-2 text-white hover:bg-purple-700 transition">
              Sign Up
            </button>
          </SignUpButton>

        </Show>


        <Show when="signed-in">
          <div className="flex items-center justify-center rounded-full border border-gray-700 bg-dark-2 p-1">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                  userButtonPopoverCard: "bg-dark-2 text-white",
                  userButtonPopoverActionButton:"hover:bg-dark-3",
                },
              }}
              />
          </div>
        </Show>


        <MobileNav />

      </div>
    </nav>
    
  )
}

export default Navbar