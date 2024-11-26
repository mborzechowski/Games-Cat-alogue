import Image from 'next/image';
import { format } from 'date-fns';
import WishlistButton from '../WishlistButton';
import PremieresScreenshots from './PremieresScreenshots';

const GamesList = ({ selectedDate, gamesForSelectedDate }) => {
  const formattedDate = format(selectedDate, 'MMMM dd, yyyy');

  return (
    <div>
      <h3 className='my-6 text-xl'>Games releasing on {formattedDate}</h3>
      <ul className='grid grid-cols-1 gap-4'>
        {gamesForSelectedDate.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </ul>
    </div>
  );
};

const GameCard = ({ game }) => {
  const coverImage = game.cover
    ? game.cover.url.replace('t_thumb', 't_cover_big')
    : '/temp_cover.png';

  return (
    <li className='mb-4 flex gap-4 p-2 w-full items-start'>
      <div className='md:min-w-[180px] md:min-h-[239px] min-w-[128px] min-h-[170px] relative rounded-md overflow-hidden'>
        <Image
          src={fixUrl(coverImage)}
          alt={game.name}
          width={128}
          height={170}
          className='object-contain'
        />
      </div>
      <div>
        <div className='font-bold flex'>
          {game.name}
          <WishlistButton game={game} />
        </div>

        <p>
          <strong>Platform:</strong> {formatList(game.platforms, 'name')}
        </p>

        <div className='hidden md:flex flex-col'>
          {game.genres?.length > 0 && (
            <div>
              <strong>Genres:</strong> {formatList(game.genres, 'name')}
            </div>
          )}
          {game.summary && (
            <div>
              <strong>Summary:</strong> {game.summary}
            </div>
          )}
          {game.screenshots?.length > 0 && (
            <PremieresScreenshots screenshots={game.screenshots.slice(0, 5)} />
          )}
        </div>
      </div>
    </li>
  );
};

const fixUrl = (url) => {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  return url;
};

const formatList = (items, key) => {
  if (!items || items.length === 0) return 'N/A';
  return items.map((item) => item[key]).join(', ');
};

export default GamesList;
