import { useSession } from 'next-auth/react';
import { useState } from 'react';
import PlatformMenu from './PlatformMenu';
import AddToLibraryButton from './AddToLibraryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useAddGameTo } from '@/utils/useAddGameTo';

const GameItem = ({ game, isActive, toggleMenu, toggleGameDetails }) => {
  const { data: session } = useSession();
  const [checkedPlatforms, setCheckedPlatforms] = useState([]);

  const handleIconClick = () => {
    toggleMenu(game.id);
  };

  const handleAddToWishlist = () => {
    useAddGameTo(
      game,
      session,
      null,
      'wishlist',
      checkedPlatforms,
      setCheckedPlatforms
    );
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
          <AddToLibraryButton onClick={handleIconClick} />
          <PlatformMenu
            game={game}
            session={session}
            isActive={isActive}
            checkedPlatforms={checkedPlatforms}
            setCheckedPlatforms={setCheckedPlatforms}
            onClose={() => toggleMenu(game.id)}
          />
        </div>
        <FontAwesomeIcon
          icon={faHeartCirclePlus}
          className='icon w-6 h-6 cursor-pointer ml-2 hover:text-red-600'
          onClick={handleAddToWishlist}
        />
      </div>
    </div>
  );
};

export default GameItem;
