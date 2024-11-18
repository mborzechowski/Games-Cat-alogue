import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import PlatformMenu from './PlatformMenu';
import AddToLibraryButton from './AddToLibraryButton';
import WishlistButton from './WishlistButton';

const GameItem = ({ game, isActive, toggleMenu, toggleGameDetails }) => {
  const { data: session } = useSession();
  const [checkedPlatforms, setCheckedPlatforms] = useState([]);
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    const releaseDate = game.release_dates && game.release_dates[0]?.human;

    if (releaseDate && releaseDate !== 'unknown') {
      const releaseDateObject = new Date(releaseDate);

      if (!isNaN(releaseDateObject.getTime())) {
        setIsReleased(releaseDateObject <= new Date());
      } else {
        setIsReleased(false);
      }
    } else {
      setIsReleased(false);
    }
  }, [game.release_dates]);

  const handleIconClick = () => {
    toggleMenu(game.id);
  };

  return (
    <div className='flex flex-row items-center gap-0 '>
      <img
        src={
          game.cover
            ? game.cover.url.replace('t_thumb', 't_cover_big')
            : '/temp_cover.png'
        }
        alt={game.name || 'Placeholder cover'}
        className='rounded-lg w-24 h-auto cursor-pointer'
        onClick={() => toggleGameDetails(game)}
      />
      <div className='relative bg-black rounded-r-xl p-2 pl-6 w-full sm:w-2/5'>
        <h2 className='lg:text-lg text-sm mt-2 mb-2 flex flex-col gap-1 items-center'>
          <p className='truncate sm:max-w-sm max-w-[12rem] px-2'>{game.name}</p>
          <p className='text-xs'>
            {game.release_dates && game.release_dates[0]?.human && (
              <> ({new Date(game.release_dates[0].human).getFullYear()})</>
            )}
          </p>
        </h2>
        <div className='flex justify-center'>
          {isReleased && <AddToLibraryButton onClick={handleIconClick} />}
          <PlatformMenu
            game={game}
            session={session}
            isActive={isActive}
            checkedPlatforms={checkedPlatforms}
            setCheckedPlatforms={setCheckedPlatforms}
            onClose={() => toggleMenu(game.id)}
          />
          {!isReleased && (
            <p>
              <strong>Premiere: </strong>
              {game.release_dates && game.release_dates[0]?.human !== 'unknown'
                ? game.release_dates[0].human
                : 'unknown'}
            </p>
          )}
          <WishlistButton game={game} />
        </div>
      </div>
    </div>
  );
};

export default GameItem;
