import GameItem from './GameItem';
import GameDetails from './GameDetails';

const GameList = ({
  games,
  activeMenuId,
  toggleMenu,
  activeGameDetails,
  toggleGameDetails,
}) => {
  return (
    <div className='grid grid-cols-2 gap-4'>
      {games.map((game) => (
        <div key={game.id}>
          <GameItem
            game={game}
            isActive={activeMenuId === game.id}
            toggleMenu={toggleMenu}
            toggleGameDetails={toggleGameDetails}
          />
          {activeGameDetails?.id === game.id && (
            <GameDetails game={activeGameDetails} />
          )}
        </div>
      ))}
    </div>
  );
};

export default GameList;
