import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquarePlus,
  faHeartCirclePlus,
} from '@fortawesome/free-solid-svg-icons';

const GameItem = ({ game, isActive, toggleMenu, toggleGameDetails }) => {
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
                    onClick={() => alert(`Selected platform: ${platform.name}`)}
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
