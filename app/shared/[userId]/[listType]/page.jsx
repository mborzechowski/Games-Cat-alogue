'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GameDetails from '@/components/GameDetails';

const SharedListPage = () => {
  const { userId, listType } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const decodedListType = decodeURIComponent(listType);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDetails, setShowGameDetails] = useState(false);

  useEffect(() => {
    if (userId && listType) {
      setLoading(true);
      fetch(`/api/shared/${userId}/${listType}`)
        .then((response) => response.json())
        .then((data) => {
          setGames(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching shared list:', error);
          setError('Failed to load games.');
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('Missing userId or listType.');
    }
  }, [userId]);

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setShowGameDetails(true);
  };

  const handleCloseDetails = () => {
    setShowGameDetails(false);
    setTimeout(() => {
      setSelectedGame(null);
    }, 500);
  };

  const handleSave = (updatedGame) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game._id === updatedGame._id ? updatedGame : game
      )
    );
    setSelectedGame(updatedGame);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='md:ml-20 lg:ml-72 xl:ml-62 2xl:ml-32'>
      <h1 className='text-red-600 lg:mt-48 lg:mb-8 lg:text-xl mt-20 mb-8 lg:ml-0 text-md ml-10 inline-block'>
        Shared List - {decodedListType || 'Loading...'}
      </h1>
      <div className='flex flex-wrap gap-4 mb-8 lg:justify-start justify-evenly'>
        {games.map((game) => (
          <div key={game._id} className='relative group cursor-pointer'>
            <img
              src={game.cover_image.replace('t_thumb', 't_cover_big')}
              alt={game.title}
              className='rounded-lg w-20 h-auto'
            />
            <div
              className='absolute left-1/2 transform -translate-x-1/2 w-full h-full top-0 px-2 pt-3 bg-black text-red-600 text-center text-xs rounded-lg opacity-0 hover:opacity-100 hover:bg-opacity-85 transition-opacity duration-300'
              onClick={() => handleGameClick(game)}
            >
              {game.title}
            </div>
            <h2></h2>
          </div>
        ))}
        {selectedGame && (
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transform transition-all duration-500 ease-in-out ${
              showGameDetails ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <GameDetails
              game={selectedGame}
              onClose={handleCloseDetails}
              onSave={handleSave}
              onDelete={() => handleDeleteGame(selectedGame._id)}
              shared={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedListPage;
