const GameDetails = ({ game }) => {
  return (
    <div className='p-4 bg-gray-800 text-white rounded-md mt-4'>
      <h2 className='text-xl font-bold'>{game.name}</h2>
      {game.cover && (
        <img
          src={game.cover.url.replace('t_thumb', 't_cover_big')}
          alt={game.name}
          className='mt-4 mb-4 w-full h-auto'
        />
      )}
      <p>
        <strong>Release Date:</strong> {game.releaseDate || 'Unknown'}
      </p>
      <p>
        <strong>Developer:</strong> {game.developer || 'Unknown'}
      </p>
      <p>
        <strong>Publisher:</strong> {game.publisher || 'Unknown'}
      </p>
      <p>
        <strong>Genres:</strong>{' '}
        {game.genres?.map((genre) => genre.name).join(', ') || 'No genres'}
      </p>
    </div>
  );
};

export default GameDetails;
