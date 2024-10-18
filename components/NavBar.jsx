'use client';
import Link from 'next/link';
import MainDashboard from './MainDashboard';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

const NavBar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='bg-black shadow-md lg:w-72 md:w-42 w-full lg:h-full h-16 flex lg:flex-col flex-row items-center fixed justify-between lg:justify-start py-4 lg:py-10 px-4 lg:px-0 z-10 mr-10'>
      <Link
        href='/'
        className='text-white lg:text-3xl text-lg lg:mb-36 lg:mt-10 text-center flex'
      >
        <p className='text-red-600'>Games</p> Catalogue
      </Link>

      <div className='lg:hidden flex items-center gap-4'>
        {session ? (
          <Image
            className='h-6 w-6 lg:h-8 lg:w-8 rounded-full'
            src={profileImage}
            width={32}
            height={32}
            alt='Profile Picture'
          />
        ) : (
          <button
            onClick={() => signIn()}
            className='text-white hover:text-red-600'
          >
            Login
          </button>
        )}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='text-white hover:text-red-600 focus:outline-none'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16m-7 6h7'
            />
          </svg>
        </button>
      </div>

      {/* Main Dashboard & Logout/Login for Large Screens */}
      <div
        className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } lg:flex flex-col items-center gap-4 mt-10 lg:mt-0 lg:ml-0 ml-auto lg:w-auto w-full h-auto pb-5 lg:static fixed bottom-0 left-0 bg-black lg:bg-transparent z-10`}
      >
        {/* MainDashboard - hidden under menu on small screens */}
        <MainDashboard />

        {session ? (
          <div className='flex items-center gap-4 -ml-20 lg:mt-40 text-sm'>
            <Image
              className='h-6 w-6 rounded-full'
              src={profileImage}
              width={30}
              height={30}
              alt='Profile Picture'
            />
            <button
              onClick={() => signOut()}
              className='text-red-600 hover:text-white'
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className='text-red-600 hover:text-white lg:mt-40'
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
