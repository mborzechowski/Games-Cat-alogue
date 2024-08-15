'use client';
import Link from 'next/link';
import MainDashboard from './MainDashboard';
import Image from 'next/image';

const NavBar = () => {
  return (
    <nav className='w-72 h-auto ml-24 bg-blue-900 py-10 shadow-md flex flex-col items-center'>
      <Link
        href='/'
        className='text-white font-bold text-5xl mb-10 bebas-neue-regular'
      >
        Games Catalogue
      </Link>
      <MainDashboard />
    </nav>
  );
};

export default NavBar;
