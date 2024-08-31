import { useState, useEffect } from 'react';
import axios from 'axios';

const PlatformMenu = ({
  game,
  session,
  isActive,
  checkedPlatforms,
  setCheckedPlatforms,
}) => {
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(false);

  useEffect(() => {
    if (isActive) {
      checkIfGameInLibrary(game.id);
    }
  }, [isActive]);

  const checkIfGameInLibrary = async (gameId) => {
    if (!session) {
      alert('You need to be logged in to check your library.');
      return;
    }

    setIsCheckingLibrary(true);
    try {
      const response = await axios.get(
        `/api/checkGameInLibrary?igdb_id=${gameId}`
      );
      setCheckedPlatforms(response.data.platforms || []);
    } catch (error) {
      console.error('Error checking game in library:', error);
    } finally {
      setIsCheckingLibrary(false);
    }
  };

  const handlePlatformSelect = async (platform) => {
    if (!session) {
      alert('You need to be logged in to add a game to your library.');
      return;
    }

    if (checkedPlatforms.includes(platform.id)) {
      alert('This game is already in your library on this platform.');
      return;
    }

    try {
      const response = await axios.post('/api/addGame', {
        igdb_id: game.id,
        title: game.name,
        platforms: [platform],
        genres: game.genres.map((g) => ({ id: g.id, name: g.name })),
        cover_image: game.cover.url,
        rating: 5,
        personal_notes: 'My notes',
        status: 'owned',
      });

      if (response.status === 200) {
        alert('Game added to library successfully.');
        setCheckedPlatforms([...checkedPlatforms, platform.id]);
      } else {
        alert('Failed to add game to library.');
      }
    } catch (error) {
      console.error('Error adding game to library:', error);
      alert('Failed to add game to library.');
    }
  };

  return (
    isActive && (
      <div className='absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10'>
        {isCheckingLibrary ? (
          <p className='p-2 text-black'>Checking library...</p>
        ) : game.platforms && game.platforms.length > 0 ? (
          game.platforms.map((platform) => {
            const isAdded = checkedPlatforms.includes(platform.id);
            return (
              <div
                key={platform.id}
                className={`p-2 ${
                  isAdded
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'hover:bg-gray-100 cursor-pointer text-black'
                }`}
                onClick={() => !isAdded && handlePlatformSelect(platform)}
              >
                {platform.name} {isAdded && '✅'}
              </div>
            );
          })
        ) : (
          <p className='p-2 text-black'>No platforms available</p>
        )}
      </div>
    )
  );
};

export default PlatformMenu;
