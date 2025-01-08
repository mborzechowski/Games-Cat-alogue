'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { TfiClose } from 'react-icons/tfi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import Image from 'next/image';

const GalleryList = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('/api/getLibrary?onlyWithImages=true');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games data', error);
      }
    };

    fetchGames();
  }, []);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleCloseDetails = () => {
    setSelectedGame(null);
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const nextImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % selectedGame.additional_img.length
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? selectedGame.additional_img.length - 1 : prevIndex - 1
    );
  };

  if (!session) {
    return <h2 className='text-red-600 mt-96'>Login to see your Gallery</h2>;
  }

  return (
    <div className='md:ml-20 lg:ml-72 xl:ml-62 2xl:ml-32'>
      <h1 className='text-red-600 lg:mt-48 lg:mb-8 lg:text-xl mt-20 mb-8 lg:ml-0 text-lg ml-10'>
        Your Images
      </h1>

      <div className='flex flex-wrap gap-1 mb-8 justify-center lg:justify-normal'>
        {games
          .filter(
            (game) => game.additional_img && game.additional_img.length > 0
          )
          .map((game) => (
            <div
              key={game._id}
              className='relative group cursor-pointer'
              onClick={() => handleGameClick(game)}
            >
              <img
                src={game.cover_image.replace('t_thumb', 't_cover_big')}
                alt={game.title}
                className=' w-20 h-20 object-cover transition duration-300 transform hover:scale-105'
              />
            </div>
          ))}
      </div>

      {selectedGame && (
        <div className='flex absolute top-16 left-0 md:left-96 w-auto md:w-2/3'>
          <div className='bg-black p-8 md:rounded-lg max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between'>
              <h2 className='text-xl font-semibold mb-4'>
                {selectedGame.title}
              </h2>
              <TfiClose
                className='text-red-600 hover:text-red-700 cursor-pointer size-6 mr-2'
                onClick={handleCloseDetails}
              />
            </div>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
              {selectedGame.additional_img.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Additional Image ${index + 1}`}
                  className='w-full h-auto rounded-lg'
                  onClick={() => openModal(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='relative w-[90%] max-w-4xl'>
            <Image
              src={selectedGame.additional_img[currentIndex].url}
              alt={`Image ${currentIndex + 1}`}
              width={1024}
              height={800}
              className='rounded-md'
            />

            <TfiClose
              className='absolute md:top-1 md:-right-10 right-[50%] text-red-500 hover:text-red-700 bg-black p-1 rounded-md size-8 cursor-pointer'
              onClick={closeModal}
            />
            <FaChevronLeft
              className='absolute md:top-[50%] md:-left-20 text-red-500 hover:text-red-700 md:size-12 size-7 cursor-pointer'
              onClick={prevImage}
            />
            <FaChevronRight
              className='absolute md:top-[50%] md:-right-20 right-0 text-red-500 hover:text-red-700 md:size-12 size-7 cursor-pointer'
              onClick={nextImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryList;
