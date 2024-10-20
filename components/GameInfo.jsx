import { TfiClose } from 'react-icons/tfi';

const GameInfo = ({ game, onClose }) => {
  const developers = game.involved_companies
    ? game.involved_companies
        .filter((company) => company.developer)
        .map((company) => company.company.name)
        .join(', ')
    : 'Unknown';

  const publishers = game.involved_companies
    ? game.involved_companies
        .filter((company) => company.publisher)
        .map((company) => company.company.name)
        .join(', ')
    : 'Unknown';

  return (
    <div className='p-4 bg-black text-white  lg:mt-4 md:w-80 fixed w-[100vw] z-10  top-0 md:top-56 lg:top-72 right-0 md:right-12 lg:right-24 xl:right-72 shadow-md shadow-red-700 rounded-lg'>
      <div className='flex justify-between items-start'>
        <h2 className='text-xl font-bold'>{game.name}</h2>
        <TfiClose
          className='text-red-500 hover:text-red-700 size-8 pr-2 cursor-pointer'
          onClick={onClose}
        />
      </div>
      {game.cover && (
        <img
          src={game.cover.url.replace('t_thumb', 't_cover_big')}
          alt={game.name}
          className='mt-4 mb-4 w-50 h-50 rounded-lg'
        />
      )}
      <p>
        <strong>First Release:</strong>{' '}
        {game.release_dates && game.release_dates.length > 0
          ? game.release_dates[0].human
          : 'Unknown'}
      </p>
      <p>
        <strong>Developer:</strong> {developers}
      </p>
      <p>
        <strong>Publisher:</strong> {publishers}
      </p>
      <p>
        <strong>Genres:</strong>{' '}
        {game.genres?.map((genre) => genre.name).join(', ') || 'No genres'}
      </p>
    </div>
  );
};

export default GameInfo;
