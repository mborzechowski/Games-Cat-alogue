const GameDetailsHeader = ({ game, wishlist }) => {
  const date = new Date(game.release_date);
  const formattedDate = date.toLocaleDateString('pl-PL');

  const handleRedirect = (paramType, paramValue) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/library?${paramType}=${encodeURIComponent(
      paramValue
    )}`;
    window.location.href = url;
  };
  console.log(game);

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
        {game.platforms.length > 0 &&
          game.platforms
            .map((p, index) => (
              <span
                key={index}
                className={`${
                  !wishlist ? 'cursor-pointer hover:text-red-600' : ''
                }`}
                onClick={() => !wishlist && handleRedirect('platform', p.name)}
              >
                {p.name}
              </span>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
      </p>

      {!wishlist && (
        <p>
          <strong>Medium:</strong>{' '}
          {game.platforms.length > 0 &&
            game.platforms
              .map((p, index) => (
                <span
                  key={index}
                  className='cursor-pointer hover:text-red-600'
                  onClick={() => handleRedirect('medium', p.medium)}
                >
                  {p.medium}
                </span>
              ))
              .reduce((prev, curr) => [prev, ', ', curr])}
        </p>
      )}

      <p>
        <strong>Genres:</strong>{' '}
        {game.genres
          .map((g, index) => (
            <span
              key={index}
              className={`${
                !wishlist ? 'cursor-pointer hover:text-red-600' : ''
              }`}
              onClick={() => !wishlist && handleRedirect('genre', g.name)}
            >
              {g.name}
            </span>
          ))
          .reduce((prev, curr) => [prev, ', ', curr])}
      </p>

      {game.themes && game.themes.length > 0 && (
        <p>
          <strong>Themes:</strong>{' '}
          {game.themes
            .map((theme, index) => (
              <span
                key={index}
                className={`${
                  !wishlist ? 'cursor-pointer hover:text-red-600' : ''
                }`}
                onClick={() => !wishlist && handleRedirect('theme', theme)}
              >
                {theme}
              </span>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
        </p>
      )}

      <p>
        <strong>Game Modes:</strong>{' '}
        {game.game_modes.length > 0 &&
          game.game_modes
            .map((mode, index) => (
              <span
                key={index}
                className={`${
                  !wishlist ? 'cursor-pointer hover:text-red-600' : ''
                }`}
                onClick={() => !wishlist && handleRedirect('gameModes', mode)}
              >
                {mode}
              </span>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
      </p>
      <p>
        <strong>Player Perspectives:</strong>{' '}
        {game.player_perspectives.length > 0 &&
          game.player_perspectives
            .map((perspective, index) => (
              <span
                key={index}
                className={`${
                  !wishlist ? 'cursor-pointer hover:text-red-600' : ''
                }`}
                onClick={() =>
                  !wishlist && handleRedirect('playerPerspectives', perspective)
                }
              >
                {perspective}
              </span>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
      </p>
      <p>
        <strong>Franchises:</strong>{' '}
        {game.franchises.length > 0 &&
          game.franchises
            .map((franchise, index) => (
              <span
                key={index}
                className={`${
                  !wishlist ? 'cursor-pointer hover:text-red-600' : ''
                }`}
                onClick={() =>
                  !wishlist && handleRedirect('franchises', franchise)
                }
              >
                {franchise}
              </span>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
      </p>
      <p>
        <strong>Developer:</strong>{' '}
        {game.developer && (
          <span
            className={`${
              !wishlist ? 'cursor-pointer hover:text-red-600' : ''
            }`}
            onClick={() =>
              !wishlist && handleRedirect('developer', game.developer)
            }
          >
            {game.developer}
          </span>
        )}
      </p>
      <p>
        <strong>Publisher:</strong>{' '}
        {game.publisher.length > 0 &&
          game.publisher
            .map((publisher, index) => (
              <span
                key={index}
                className={`${
                  !wishlist ? 'cursor-pointer hover:text-red-600' : ''
                }`}
                onClick={() =>
                  !wishlist && handleRedirect('publisher', publisher)
                }
              >
                {publisher}
              </span>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
      </p>
    </>
  );
};

export default GameDetailsHeader;
