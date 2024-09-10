import { useSession } from 'next-auth/react';
import { useState } from 'react';
import PlatformMenu from './PlatformMenu';
import AddToLibraryButton from './AddToLibraryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const GameItem = ({ game, isActive, toggleMenu, toggleGameDetails }) => {
  const { data: session } = useSession();
  const [checkedPlatforms, setCheckedPlatforms] = useState([]);

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
        platforms: game.platforms.map((platform) => ({
          id: platform.id,
          name: platform.name,
        })),
        genres: game.genres.map((g) => ({ id: g.id, name: g.name })),
        cover_image: game.cover.url,
        rating: 0,
        personal_notes: 'My notes',
        lists: 'whislist',
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
