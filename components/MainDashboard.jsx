'use client';
import Link from 'next/link';
import React from 'react';

import { TfiGallery } from 'react-icons/tfi';
import { BsClipboardData } from 'react-icons/bs';
import { IoCalendarNumberOutline, IoSearchOutline } from 'react-icons/io5';

import { IoGameControllerOutline, IoListCircleOutline } from 'react-icons/io5';

const MainDashboard = ({ closeMenu }) => {
  const buttons = [
    { icon: IoSearchOutline, label: 'Search', href: '/search' },
    { icon: IoGameControllerOutline, label: 'Library', href: '/library' },
    { icon: IoListCircleOutline, label: 'Lists', href: '/lists' },
    { icon: TfiGallery, label: 'Gallery', href: '/gallery' },
    { icon: IoCalendarNumberOutline, label: 'Premieres', href: '/premieres' },
  ];

  return (
    <div className='flex flex-col items-center py-8 space-y-6 bg-black'>
      {buttons.map((button, index) => (
        <div key={index} className='flex justify-start items-center'>
          <Link
            href={button.href}
            className='flex flex-row group w-64 h-10 bg-black  transition duration-300 transform hover:scale-105 hover:text-white text-gray-300 items-center justify-start gap-6 px-8'
            onClick={closeMenu}
          >
            {React.createElement(button.icon, {
              className:
                'icon w-8 h-8 text-gray-500 group-hover:text-red-600 transition duration-300',
            })}
            <span className='text-lg font-semibold'>{button.label}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainDashboard;
