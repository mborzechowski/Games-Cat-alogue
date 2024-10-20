'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import GameDetails from '@/components/GameDetails';

const Lists = () => {
  const [activeTab, setActiveTab] = useState('Wishlist');
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDetails, setShowGameDetails] = useState(false);

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

  const fetchGames = async (listType) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/getLibrary?list=${encodeURIComponent(listType)}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGames(data);
    } catch (err) {
      console.error('Error fetching library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || status === 'loading') {
      return;
    }
    fetchGames(activeTab);
  }, [activeTab, session, status]);

  const tabs = ['Wishlist', 'Next in line', 'On loan', 'On hold', 'On sale'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Wishlist':
      case 'Next in line':
      case 'On loan':
      case 'On hold':
      case 'On sale':
        return (
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
                  showGameDetails
                    ? 'scale-100 opacity-100'
                    : 'scale-95 opacity-0'
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
      default:
        return <div>Select a tab to see content.</div>;
    }
  };

  return (
    <div className='lg:mt-44 md:ml-20 lg:ml-72 xl:ml-62 2xl:ml-28 mt-20'>
      <div className='flex lg:gap-4 gap-2 flex-wrap justify-center lg:justify-normal'>
        {tabs.map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`lg:px-4 py-2 -mb-px  lg:text-xl text-md border-b-2 ${
              activeTab === tabName
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-600'
            } hover:text-red-600`}
          >
            {tabName}
          </button>
        ))}
      </div>

      {session ? (
        <div className='mt-4 p-4'>{renderContent()}</div>
      ) : (
        <h2 className='text-red-600 mt-44'>Login to see your list</h2>
      )}
    </div>
  );
};

export default Lists;
