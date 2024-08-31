import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquarePlus,
  faHeartCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const GameItem = ({ game, isActive, toggleMenu, toggleGameDetails }) => {
  const { data: session } = useSession();

  const handlePlatformSelect = async (platform) => {
    if (!session) {
      alert('You need to be logged in to add a game to your library.');
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
      } else {
        alert('Failed to add game to library.');
      }
    } catch (error) {
      console.error('Error adding game to library:', error);
      alert('Failed to add game to library.');
    }
  };

  return (
    <div className='flex flex-row items-center gap-4'>
      {game.cover && (
        <img
          src={game.cover.url}
          alt={game.name}
          className='w-auto rounded-xl'
          onClick={() => toggleGameDetails(game)}
        />
      )}
      <div className='relative'>
        <h2 className='text-lg mt-2 mb-2'>{game.name}</h2>
        <div className='relative inline-block'>
          <FontAwesomeIcon
            icon={faSquarePlus}
            className='icon w-6 h-6 cursor-pointer hover:text-red-600'
            onClick={() => toggleMenu(game.id)}
          />
          {isActive && (
            <div className='absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10'>
              {game.platforms && game.platforms.length > 0 ? (
                game.platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className='p-2 hover:bg-gray-100 cursor-pointer text-black'
                    onClick={() => handlePlatformSelect(platform)}
                  >
                    {platform.name}
                  </div>
                ))
              ) : (
                <p className='p-2 text-black'>No platforms available</p>
              )}
            </div>
          )}
        </div>
        <FontAwesomeIcon
          icon={faHeartCirclePlus}
          className='icon w-6 h-6 cursor-pointer ml-2 hover:text-red-600 '
        />
      </div>
    </div>
  );
};

export default GameItem;
