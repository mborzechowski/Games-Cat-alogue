'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import GameDetails from '@/components/GameDetails';
import { toast } from 'react-toastify';
import { setTimeout } from 'timers';

const LibraryList = () => {
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDetails, setShowGameDetails] = useState(false);

  const [platformOptions, setPlatformOptions] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [franchiseOptions, setFranchiseOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [developerOptions, setDeveloperOptions] = useState([]);
  const [publisherOptions, setPublisherOptions] = useState([]);

  useEffect(() => {
    if (!session || status === 'loading') {
      return;
    }

    const fetchLibrary = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/getLibrary?whislist=false');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGames(data);
      } catch (err) {
        toast.error('Error fetching library:', err);
        setError('Failed to load library.');
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [session, status]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/getFilters');
        const data = await response.json();
        setPlatformOptions(data.platforms);
        setGenreOptions(data.genres);
        setFranchiseOptions(data.franchises);
        setThemeOptions(data.themes);
        setDeveloperOptions(data.developers);
        setPublisherOptions(data.publishers);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  const [filters, setFilters] = useState({
    platforms: [],
    genres: [],
    rating: [0, 10],
    franchises: [],
    themes: [],
    developer: [],
    publisher: [],
  });

  const handleFilterChange = (e, type) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setShowGameDetails(true);
  };

  const handleCloseDetails = () => {
    setShowGameDetails(false);
    setTimeout(() => {
      setSelectedGame(null);
    }, 500);
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

  if (status === 'loading') {
    return null;
  }

  if (loading) {
    return (
      <div className='md:ml-20 lg:ml-72 xl:ml-62 2xl:ml-32 '>
        <h1 className='text-red-600 lg:mt-48 lg:mb-8 lg:text-xl mt-20 mb-8 lg:ml-0 text-lg ml-10'>
          Your Library
        </h1>
        <div className='flex justify-center items-center mt-24'>
          <Spinner loading={true} />
        </div>
      </div>
    );
  }

  if (!session) {
    return <h2 className='text-red-600 mt-96'>Login to see your library</h2>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='md:ml-20 lg:ml-72 xl:ml-62 2xl:ml-32 '>
      <h1 className='text-red-600 lg:mt-48 lg:mb-8 lg:text-xl mt-20 mb-8 lg:ml-0 text-lg ml-10'>
        Your Library
      </h1>

      <div className='flex flex-wrap gap-8 mb-8 justify-center lg:justify-normal '>
        {games.map((game) => (
          <div
            key={game._id}
            className='relative group cursor-pointer'
            onClick={() => handleGameClick(game)}
          >
            <img
              src={game.cover_image}
              alt={game.title}
              className='rounded-lg'
            />
            <div className='absolute left-1/2 transform -translate-x-1/2 w-full h-full top-0 px-2 py-1 bg-black text-red-600 text-center text-xs rounded-lg opacity-0 hover:opacity-100 hover:bg-opacity-85 transition-opacity duration-300 '>
              {game.title}
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

      {/* <div className='fixed right-10 top-0 transform translate-x-full hover:translate-x-12 transition-transform duration-500 ease-in-out bg-opacity-90 bg-black text-white p-4 w-96 h-full shadow-lg rounded-lg'>
        <h2 className='text-white mb-4 text-lg font-semibold ml-10'>Filters</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-10'>
          <div>
            <label className='block text-gray-300 mb-2'>Platforms</label>
            <select
              className='block w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white'
              multiple
              onChange={(e) => handleFilterChange(e, 'platforms')}
            >
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div> */}

      {/* <div>
            <label className='block text-gray-300 mb-2'>Genres</label>
            <select
              className='block w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white'
              multiple
              onChange={(e) => handleFilterChange(e, 'genres')}
            >
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div> */}

      {/* <div>
            <label className='block text-gray-300 mb-2'>Franchises</label>
            <select
              className='block w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white'
              multiple
              onChange={(e) => handleFilterChange(e, 'franchises')}
            >
              {franchiseOptions.map((franchise) => (
                <option key={franchise} value={franchise}>
                  {franchise}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-gray-300 mb-2'>Rating</label>
            <input
              type='range'
              min='0'
              max='10'
              className='w-full'
              value={filters.rating}
              onChange={(e) =>
                setFilters({ ...filters, rating: [e.target.value] })
              }
            />
          </div>

          <div>
            <label className='block text-gray-300 mb-2'>Themes</label>
            <select
              className='block w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white'
              multiple
              onChange={(e) => handleFilterChange(e, 'themes')}
            >
              {themeOptions.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-gray-300 mb-2'>Developer</label>
            <select
              className='block w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white'
              onChange={(e) =>
                setFilters({ ...filters, developer: e.target.value })
              }
            >
              <option value=''>All</option>
              {developerOptions.map((developer) => (
                <option key={developer} value={developer}>
                  {developer}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-gray-300 mb-2'>Publisher</label>
            <select
              className='block w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white'
              onChange={(e) =>
                setFilters({ ...filters, publisher: e.target.value })
              }
            >
              <option value=''>All</option>
              {publisherOptions.map((publisher) => (
                <option key={publisher} value={publisher}>
                  {publisher}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default LibraryList;
