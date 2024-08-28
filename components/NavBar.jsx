'use client';
import Link from 'next/link';
import MainDashboard from './MainDashboard';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const NavBar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  return (
    <nav className='w-72 h-auto bg-black  py-10 shadow-md flex flex-col items-center '>
      <Link
        href='/'
        className='text-white text-3xl mb-36 mt-10 text-center flex'
      >
        <p className='text-red-600'>Games</p> Catalogue
      </Link>
      <MainDashboard />
      {session ? (
        <div className='flex mt-40 gap-4 mr-8'>
          <Image
            className='h-8 w-8 rounded-full'
            src={profileImage}
            width={40}
            height={40}
            alt='profile picture'
          ></Image>
          <button onClick={() => signOut()} className='ml-4 text-red-600'>
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => signIn()} className='mr-8 mt-40'>
          Login
        </button>
      )}
    </nav>
  );
};

export default NavBar;
