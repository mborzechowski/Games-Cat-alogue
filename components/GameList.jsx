import GameItem from './GameItem';
import GameInfo from './GameInfo';

const GameList = ({
  games,
  activeMenuId,
  toggleMenu,
  activeGameDetails,
  toggleGameDetails,
}) => {
  return (
    <div className='grid grid-cols-1 gap-6 mb-24 items-start md:ml-20 lg:ml-72 xl:ml-62 2xl:ml-32'>
      {games.map((game) => (
        <div key={game.id} className=''>
          <GameItem
            game={game}
            isActive={activeMenuId === game.id}
            toggleMenu={toggleMenu}
            toggleGameDetails={toggleGameDetails}
          />
          {activeGameDetails?.id === game.id && (
            <GameInfo game={activeGameDetails} onClose={toggleGameDetails} />
          )}
        </div>
      ))}
    </div>
  );
};

export default GameList;
