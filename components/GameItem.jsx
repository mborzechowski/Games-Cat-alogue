import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import PlatformMenu from './PlatformMenu';
import AddToLibraryButton from './AddToLibraryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const GameItem = ({ game, isActive, toggleMenu, toggleGameDetails }) => {
  const { data: session } = useSession();
  const [checkedPlatforms, setCheckedPlatforms] = useState([]);
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    const releaseDate = game.release_dates && game.release_dates[0]?.human;

    if (releaseDate && releaseDate !== 'unknown') {
      const releaseDateObject = new Date(releaseDate);
      setIsReleased(releaseDateObject <= new Date());
    } else {
      setIsReleased(false);
    }
  }, [game.release_dates]);

  const handleIconClick = () => {
    toggleMenu(game.id);
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      toast.warn('You need to be logged in to add a game to whislist.');
      return;
    }
    try {
      const response = await axios.post('/api/addGame', {
        igdb_id: game.id,
        title: game.name,
        platforms: game.platforms
          ? game.platforms.map((p) => ({
              id: p.id,
              name: p.name,
              medium: 'unknown',
            }))
          : [],
        genres: game.genres
          ? game.genres.map((g) => ({ id: g.id, name: g.name }))
          : [],
        cover_image:
          game.cover && game.cover.url ? game.cover.url : '/temp_cover.png',
        rating: 0,
        personal_notes: '',
        lists: 'wishlist',
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
        dlc: game.dlcs ? game.dlcs.map((dlc) => dlc.name) : [],
        expansions: game.expansions
          ? game.expansions.map((expansion) => expansion.name)
          : [],
        release_date:
          game.release_dates &&
          game.release_dates.length > 0 &&
          game.release_dates[0].human
            ? new Date(game.release_dates[0].human)
            : null,
        finished: false,
      });

      if (response.status === 200) {
        toast.info('Game added to whislist.');
      } else {
        toast.error('Failed to add game to whislist.');
      }
    } catch (error) {
      console.error('Error adding game to whislist:', error);
      toast.error('Failed to add game to whislist.');
    }
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
          <p>{game.name}</p>
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
          <FontAwesomeIcon
            icon={faHeartCirclePlus}
            className='icon w-4 sm:w-6 h-auto cursor-pointer ml-3 hover:text-red-600'
            onClick={handleAddToWishlist}
          />
        </div>
      </div>
    </div>
  );
};

export default GameItem;
