import { useState, useEffect, useRef } from 'react';
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
  const [hoveredPlatformId, setHoveredPlatformId] = useState(null);
  const menuRef = useRef(null);
  useEffect(() => {
    if (isActive) {
      checkIfGameInLibrary(game.id);
    }
  }, [isActive]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

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

  const handlePlatformSelect = async (platform, medium) => {
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
        platforms: [
          {
            id: platform.id,
            name: platform.name,
            medium,
          },
        ],
        genres: game.genres
          ? game.genres.map((g) => ({ id: g.id, name: g.name }))
          : [],
        cover_image:
          game.cover && game.cover.url ? game.cover.url : '/temp_cover.png',
        rating: 0,
        personal_notes: '',
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
        release_date: game.release_dates[0].human
          ? new Date(game.release_dates[0].human)
          : null,
        finished: false,
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
      <div
        ref={menuRef}
        className='absolute left-0 mt-2 w-56 bg-black border border-red-600 rounded-md shadow-lg z-10 text-red-600'
      >
        <div className='flex justify-between overflow-hidden'>
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
                onMouseEnter={() => setHoveredPlatformId(platform.id)}
                onMouseLeave={() => setHoveredPlatformId(null)}
              >
                {platform.name}
                {isAdded ? (
                  <FaCheckCircle className='text-red-600 ml-2 float-right' />
                ) : (
                  hoveredPlatformId === platform.id && (
                    <div className=' absolute flex flex-col rounded-md overflow-hidden md:left-52 -left-16 -mt-7 bg-black border-red-600 border '>
                      <button
                        className='text-s px-4 pt-2 pb-1  text-red-600 hover:bg-gray-800 cursor-pointer'
                        onClick={() =>
                          handlePlatformSelect(platform, 'physical')
                        }
                      >
                        Physical
                      </button>
                      <button
                        className='text-s  px-4 py-1 text-red-600 hover:bg-gray-800 cursor-pointer'
                        onClick={() =>
                          handlePlatformSelect(platform, 'digital')
                        }
                      >
                        Digital
                      </button>
                    </div>
                  )
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
