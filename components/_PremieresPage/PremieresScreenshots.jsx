import { useState } from 'react';
import Image from 'next/image';
import { TfiClose } from 'react-icons/tfi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const Screenshots = ({ screenshots }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className='mt-4'>
      <h4 className='text-lg font-semibold'>Screenshots:</h4>
      <div className='flex gap-2 flex-wrap'>
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            className='relative w-32 h-32 flex-shrink-0 cursor-pointer'
            onClick={() => openModal(index)}
          >
            <Image
              src={`https:${screenshot.url.replace(
                't_thumb',
                't_screenshot_med'
              )}`}
              alt={`Screenshot ${index + 1}`}
              width={120}
              height={120}
              className='rounded-md'
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='relative w-[90%] max-w-4xl'>
            <Image
              src={`https:${screenshots[currentIndex].url.replace(
                't_thumb',
                't_screenshot_big'
              )}`}
              alt={`Screenshot ${currentIndex + 1}`}
              width={800}
              height={450}
              className='rounded-md'
            />

            <TfiClose
              className='absolute top-1 right-10 text-red-500 hover:text-red-700 bg-black p-1 rounded-md size-8 cursor-pointer'
              onClick={closeModal}
            />
            <FaChevronLeft
              className='absolute top-[50%] -left-20 text-red-500 hover:text-red-700 size-12 cursor-pointer'
              onClick={prevImage}
            />

            <FaChevronRight
              className='absolute top-[50%] right-0 text-red-500 hover:text-red-700 size-12 cursor-pointer'
              onClick={nextImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Screenshots;
