'use client';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGamepad,
  faDiceFive,
  faBook,
  faClapperboard,
} from '@fortawesome/free-solid-svg-icons';

const MainDashboard = () => {
  const buttons = [
    { icon: faBook, label: 'Library', href: '/library' },
    { icon: faGamepad, label: 'Timeline', href: '/timeline' },
    { icon: faDiceFive, label: 'Lists', href: '/lists' },
    { icon: faClapperboard, label: 'Gallery', href: '/gallery' },
  ];

  return (
    <div className='flex flex-col items-center py-8 space-y-4'>
      {buttons.map((button, index) => (
        <div key={index} className='flex justify-start items-center'>
          <Link
            href={button.href}
            className=' flex flex-row group w-60 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition duration-300 transform hover:scale-105 shadow-lg text-white rounded-xl  items-center justify-between gap-4 pl-4'
          >
            <FontAwesomeIcon icon={button.icon} className='icon' />
            <span className='text-s pr-8'>{button.label}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainDashboard;
