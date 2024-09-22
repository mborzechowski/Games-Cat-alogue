'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import GameDetails from '@/components/GameDetails';
import { toast } from 'react-toastify';
import { setTimeout } from 'timers';

const LibraryList = () => {
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDetails, setShowGameDetails] = useState(false);

  useEffect(() => {
    if (!session || status === 'loading') {
      return;
    }

    const fetchLibrary = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/getLibrary?whislist=false');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGames(data);
      } catch (err) {
        toast.error('Error fetching library:', err);
        setError('Failed to load library.');
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [session, status]);

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

  const handleDeleteGame = (deletedGameId) => {
    setGames((prevGames) =>
      prevGames.filter((game) => game._id !== deletedGameId)
    );
    handleCloseDetails();
  };

  if (status === 'loading') {
    return null;
  }

  if (loading) {
    return (
      <>
        <h1 className='text-red-600 mt-48 mb-8 text-xl'>Your Library</h1>
        <div className='flex justify-center items-center mt-24'>
          <Spinner loading={true} />
        </div>
      </>
    );
  }

  if (!session) {
    return <h2 className='text-red-600 mt-96'>Login to see your library</h2>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className='text-red-600 mt-48 mb-8 text-xl'>Your Library</h1>

      <div className='grid grid-cols-10 gap-8'>
        {games.map((game) => (
          <div
            key={game._id}
            className='relative group cursor-pointer'
            onClick={() => handleGameClick(game)}
          >
            <img
              src={game.cover_image}
              alt={game.title}
              className='rounded-lg'
            />
            <div className='absolute left-1/2 transform -translate-x-1/2 mt-2 w-max px-2 py-1 bg-black text-red-600 text-center text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-9'>
              {game.title}
              <p className='text-gray-400 text-center'>
                {' '}
                {game.platforms.map((p) => p.name).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
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
          />
        </div>
      )}
    </div>
  );
};
export default LibraryList;
