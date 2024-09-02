const GameDetails = ({ game, onClose }) => {
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
    <div className='p-4 bg-black text-white  mt-4 w-80 absolute z-10 top-56 right-24 border-2 border-red-700'>
      <div className='flex justify-between items-start'>
        <h2 className='text-xl font-bold'>{game.name}</h2>
        <button
          className='text-red-500 hover:text-red-700 text-lg pr-2'
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      {game.cover && (
        <img
          src={game.cover.url.replace('t_thumb', 't_cover_big')}
          alt={game.name}
          className='mt-4 mb-4 w-50 h-50'
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

export default GameDetails;
