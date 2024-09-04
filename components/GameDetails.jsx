'use client';

const GameDetails = ({ game, onClose, onDelete }) => {
  return (
    <div className='p-4 bg-black text-white mt-4 w-1/2 absolute z-10 top-20 left-1/2 transform -translate-x-1/2 border-2 border-red-700 rounded-lg'>
      <button
        className='text-red-500 hover:text-red-700 text-lg pr-2 float-right'
        onClick={onClose}
      >
        &times;
      </button>

      <div className='flex mb-4'>
        <div className='w-1/3'>
          <img
            src={game.cover_image.replace('t_thumb', 't_cover_big')}
            alt={game.title}
            className='w-full h-auto rounded-lg'
          />
        </div>
        <div className='w-1/2 pl-6'>
          <h2 className='text-xl font-bold mb-2'>{game.title}</h2>
          <p>
            <strong>Platform:</strong>{' '}
            {game.platforms.map((p) => p.name).join(', ')}
          </p>
          <p>
            <strong>Genres:</strong> {game.genres.map((g) => g.name).join(', ')}
          </p>
          <p>
            <strong>Rating:</strong> {game.rating}
          </p>
          <p>
            <strong>Notes:</strong> {game.personal_notes}
          </p>
          <p>
            <strong>Themes:</strong> {game.themes.join(', ')}
          </p>
          <p>
            <strong>Game Modes:</strong> {game.game_modes.join(', ')}
          </p>
          <p>
            <strong>Player Perspectives:</strong>{' '}
            {game.player_perspectives.join(', ')}
          </p>
          <p>
            <strong>Franchises:</strong> {game.franchises.join(', ')}
          </p>
        </div>
      </div>
      <div className='mt-4'>
        {game.summary && (
          <p className='text-justify'>
            <strong>Summary:</strong> {game.summary}
          </p>
        )}

        <div className='flex justify-end mt-4'>
          <button
            onClick={() => {
              alert('Edit functionality not implemented yet.');
            }}
            className='bg-yellow-500 text-white px-4 py-1 rounded-lg mr-2'
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(game)}
            className='bg-red-600 text-white px-4 py-1 rounded-lg'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
