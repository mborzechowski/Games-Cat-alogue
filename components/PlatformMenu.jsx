import { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlatformMenu = ({
  game,
  session,
  isActive,
  checkedPlatforms,
  setCheckedPlatforms,
  onClose,
}) => {
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(false);

  useEffect(() => {
    if (isActive) {
      checkIfGameInLibrary(game.id);
    }
  }, [isActive]);

  const checkIfGameInLibrary = async (gameId) => {
    setIsCheckingLibrary(true);
    try {
      const response = await axios.get(
        `/api/checkGameInLibrary?igdb_id=${gameId}`
      );
      setCheckedPlatforms(response.data.platforms || []);
    } catch (error) {
      toast.error('Error checking game in library:', error);
    } finally {
      setIsCheckingLibrary(false);
    }
  };

  const handlePlatformSelect = async (platform) => {
    if (!session) {
      toast.warn('You need to be logged in to add a game to your library.');
      return;
    }

    if (checkedPlatforms.includes(platform.id)) {
      toast.warn('This game is already in your library on this platform.');
      return;
    }

    try {
      const response = await axios.post('/api/addGame', {
        igdb_id: game.id,
        title: game.name,
        platforms: [platform],
        genres: game.genres.map((g) => ({ id: g.id, name: g.name })),
        cover_image: game.cover.url,
        rating: 0,
        personal_notes: 'My notes',
        lists: [],
        summary: game.summary || '',
        category: game.category || '',
        themes: game.themes ? game.themes.map((t) => t.name) : [],
        game_modes: game.game_modes
          ? game.game_modes.map((mode) => mode.name)
          : [],
        player_perspectives: game.player_perspectives
          ? game.player_perspectives.map((perspective) => perspective.name)
          : [],
        franchises: game.franchises
          ? game.franchises.map((franchise) => franchise.name)
          : [],
        developer: game.involved_companies
          ? game.involved_companies
              .filter((company) => company.developer)
              .map((company) => company.company.name)
          : [],
        publisher: game.involved_companies
          ? game.involved_companies
              .filter((company) => company.publisher)
              .map((company) => company.company.name)
          : [],
        dlc: game.dlcs ? game.dlcs.map(Number) : [],
        expansions: game.expansions ? game.expansions.map(Number) : [],
      });

      if (response.status === 200) {
        toast.info('Game added to library successfully.');
        setCheckedPlatforms([...checkedPlatforms, platform.id]);
      } else {
        toast.error('Failed to add game to library.');
      }
    } catch (error) {
      console.error('Error adding game to library:', error);
      toast.error('Failed to add game to library.');
    }
  };

  return (
    isActive && (
      <div className='absolute left-0 mt-2 w-56 bg-black border border-red-600 rounded-md shadow-lg z-10 text-red-600'>
        <div className='flex justify-between'>
          <p className='text-xl px-2 pb-2'>...</p>
          <button
            className='text-red-500 hover:text-red-700 text-lg pr-2'
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {isCheckingLibrary ? (
          <p className='p-2 text-black'>Checking library...</p>
        ) : game.platforms && game.platforms.length > 0 ? (
          game.platforms.map((platform) => {
            const isAdded = checkedPlatforms.includes(platform.id);
            return (
              <div
                key={platform.id}
                className={`p-2  ${
                  isAdded
                    ? 'bg-gray-900 text-red-700 cursor-not-allowed'
                    : 'hover:bg-gray-800 cursor-pointer'
                }`}
                onClick={() => !isAdded && handlePlatformSelect(platform)}
              >
                {platform.name}{' '}
                {isAdded ? (
                  <FaCheckCircle className='text-red-600 ml-2 float-right' />
                ) : (
                  ''
                )}
              </div>
            );
          })
        ) : (
          <p className='p-2'>Unknown</p>
        )}
      </div>
    )
  );
};

export default PlatformMenu;
