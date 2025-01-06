'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import GameDetails from '@/components/GameDetails';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect';

const LibraryList = () => {
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDetails, setShowGameDetails] = useState(false);
  const [queryParams, setQueryParams] = useState({});
  const [sortBy, setSortBy] = useState('Title');

  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const medium = searchParams.get('medium');
  const genres = searchParams.get('genre');
  const themes = searchParams.get('theme');
  const gameModes = searchParams.get('gameModes');
  const playerPerspectives = searchParams.get('playerPerspectives');
  const franchises = searchParams.get('franchises');
  const developer = searchParams.get('developer');
  const publisher = searchParams.get('publisher');

  useEffect(() => {
    setQueryParams({
      Platform: searchParams.get('platform'),
      Medium: searchParams.get('medium'),
      Genre: searchParams.get('genre'),
      Themes: searchParams.get('theme'),
      'Game Modes': searchParams.get('gameModes'),
      'Player Perspectives': searchParams.get('playerPerspectives'),
      Franchises: searchParams.get('franchises'),
      Developer: searchParams.get('developer'),
      Publisher: searchParams.get('publisher'),
    });
  }, [searchParams]);

  useEffect(() => {
    if (!session || status === 'loading') {
      return;
    }

    const fetchLibrary = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (platform) queryParams.set('platform', platform);
        if (medium) queryParams.set('medium', medium);
        if (genres) queryParams.set('genres', genres);
        if (themes) queryParams.set('themes', themes);
        if (gameModes) queryParams.set('gameModes', gameModes);
        if (playerPerspectives)
          queryParams.set('playerPerspectives', playerPerspectives);
        if (franchises) queryParams.set('franchises', franchises);
        if (developer) queryParams.set('developer', developer);
        if (publisher) queryParams.set('publisher', publisher);

        const url = `/api/getLibrary?${queryParams.toString()}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const games = data.sort((a, b) => a.title.localeCompare(b.title));
        setGames(games);
      } catch (err) {
        toast.error('Error fetching library:', err);
        setError('Failed to load library.');
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [
    session,
    status,
    platform,
    medium,
    genres,
    themes,
    gameModes,
    playerPerspectives,
    franchises,
    developer,
    publisher,
  ]);

  useEffect(() => {
    if (games.length > 0) {
      const sortedGames = [...games];
      if (sortBy === 'Title') {
        sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'Release Date') {
        sortedGames.sort(
          (a, b) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
        );
      } else if (sortBy === 'Added Date') {
        sortedGames.sort(
          (a, b) =>
            new Date(a.date_added).getTime() - new Date(b.date_added).getTime()
        );
      } else if (sortBy === 'Rating') {
        sortedGames.sort((a, b) => a.rating - b.rating);
      }
      setGames(sortedGames);
    }
  }, [sortBy]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setShowGameDetails(true);
  };

  const handleCloseDetails = () => {
    setShowGameDetails(false);
    setTimeout(() => {
      setSelectedGame(null);
    }, 400);
  };

  const handleSave = (updatedGame) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game._id === updatedGame._id ? updatedGame : game
      )
    );
    setSelectedGame(updatedGame);
  };

  const handleDeleteGame = (deletedGameId) => {
    setGames((prevGames) =>
      prevGames.filter((game) => game._id !== deletedGameId)
    );
    handleCloseDetails();
  };

  if (!session) {
    return <h2 className='text-red-600 mt-96'>Login to see your library</h2>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='md:ml-20 lg:ml-72 xl:ml-62 2xl:ml-32 '>
      <div className='flex justify-between'>
        <div className='text-red-600 lg:mt-48 lg:mb-8 lg:text-xl mt-20 mb-8 lg:ml-0 text-md ml-10 inline-block '>
          Your Library
          {loading && (
            <div className='flex justify-center items-center mt-24'>
              <Spinner loading={true} />
            </div>
          )}
          {Object.entries(queryParams).map(
            ([label, value]) =>
              value && (
                <span key={label}>
                  <strong> - {label} - </strong> {value}
                </span>
              )
          )}
        </div>
        {!loading && (
          <div className='lg:mt-48 mt-20 mr-10 flex justify-start'>
            <div className='px-2 py-2 text-xs text-red-600'>Sort by</div>
            <CustomSelect
              value={sortBy}
              onChange={handleSortChange}
              options={['Title', 'Release Date', 'Added Date', 'Rating']}
            />
          </div>
        )}
      </div>

      <div className='flex flex-wrap gap-6 mb-8 justify-center lg:justify-normal '>
        {games.map((game) => (
          <div
            key={game._id}
            className='relative group cursor-pointer'
            onClick={() => handleGameClick(game)}
          >
            <img
              src={game.cover_image.replace('t_thumb', 't_cover_big')}
              alt={game.title}
              className='rounded-lg w-20 h-auto'
            />
            <div className='absolute left-1/2 transform -translate-x-1/2 w-full h-full top-0 px-2 pt-8 bg-black text-center text-xs rounded-lg opacity-0 hover:opacity-100 hover:bg-opacity-85 transition-opacity duration-300 '>
              <p className='text-gray-400 text-center'>
                {game.platforms.map((p) => p.name).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
      {selectedGame && (
        <div
          className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transform transition-all duration-500 ease-in-out ${
            showGameDetails ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <GameDetails
            game={selectedGame}
            onClose={handleCloseDetails}
            onSave={handleSave}
            onDelete={() => handleDeleteGame(selectedGame._id)}
          />
        </div>
      )}
    </div>
  );
};
export default LibraryList;
