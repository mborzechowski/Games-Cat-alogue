'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const GalleryList = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const { data: session } = useSession();

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

  if (!session) {
    return <h2 className='text-red-600 mt-96'>Login to see your Gallery</h2>;
  }

  return (
    <div className='md:ml-20 lg:ml-72 xl:ml-62 2xl:ml-32'>
      <h1 className='text-red-600 lg:mt-48 lg:mb-8 lg:text-xl mt-20 mb-8 lg:ml-0 text-lg ml-10'>
        Games with Additional Images
      </h1>

      <div className='flex flex-wrap gap-6 mb-8 justify-center lg:justify-normal'>
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
                src={game.cover_image}
                alt={game.title}
                className='rounded-lg w-20 h-auto'
              />
              <div className='absolute left-1/2 transform -translate-x-1/2 w-full h-full top-0 px-2 pt-8 bg-black text-center text-xs rounded-lg opacity-0 hover:opacity-100 hover:bg-opacity-85 transition-opacity duration-300'>
                <p className='text-gray-400 text-center'>{game.title}</p>
              </div>
            </div>
          ))}
      </div>

      {selectedGame && (
        <div className=' inset-20 flex items-center justify-center p-4 w-2/3'>
          <div className='bg-white p-6 rounded-lg max-h-[80vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>{selectedGame.title}</h2>
            <div className='grid grid-cols-3 gap-4'>
              {selectedGame.additional_img.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Additional Image ${index + 1}`}
                  className='w-full h-auto rounded-lg'
                />
              ))}
            </div>
            <button
              onClick={handleCloseDetails}
              className='mt-4 text-red-600 hover:underline'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryList;
