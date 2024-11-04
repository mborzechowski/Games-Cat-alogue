const GameDetailsHeader = ({ game, wishlist }) => {
  const date = new Date(game.release_date);
  const formattedDate = date.toLocaleDateString('pl-PL');
  return (
    <>
      <h2 className='text-xl font-bold mb-2'>{game.title}</h2>
      {wishlist && (
        <p>
          <strong className='text-red-600'>Release date:</strong>{' '}
          {game.release_date && game.release_date.length > 0
            ? formattedDate
            : 'Unknown'}
        </p>
      )}

      <p>
        <strong>Platform:</strong>{' '}
        {game.platforms.map((p) => p.name).join(', ')}
      </p>
      {!wishlist && (
        <p>
          <strong>Medium:</strong>{' '}
          {game.platforms.map((p) => p.medium).join(', ')}
        </p>
      )}

      <p>
        <strong>Genres:</strong> {game.genres.map((g) => g.name).join(', ')}
      </p>

      {game.themes && (
        <p>
          <strong>Themes:</strong> {game.themes.join(', ')}
        </p>
      )}
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
      <p>
        <strong>Developer:</strong> {game.developer}
      </p>
      <p>
        <strong>Publisher:</strong> {game.publisher.join(', ')}
      </p>
    </>
  );
};

export default GameDetailsHeader;
