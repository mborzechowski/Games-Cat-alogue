'use client';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquarePlus,
  faHeartCirclePlus,
} from '@fortawesome/free-solid-svg-icons';

const SearchGame = () => {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleMenu = (gameId) => {
    if (activeMenuId === gameId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(gameId);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      igdbSearch();
    }
  };

  const igdbSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.post(
        '/api/igdb',
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setGames(response.data);
    } catch (error) {
      setError('Wystąpił błąd podczas wyszukiwania.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col mt-48  gap-8'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Search for a game...'
        className='text-white bg-transparent border-red-600 border-b-2 focus:border-red-600 focus:outline-none pl-4'
      />
      <button onClick={igdbSearch} disabled={loading} className='text-red-600'>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p>{error}</p>}

      <div>
        {hasSearched && games.length === 0 && !loading && (
          <p>No games found.</p>
        )}
        <div className='grid grid-cols-2 gap-4'>
          {games.map((game) => (
            <div key={game.id} className='flex flex-row items-center gap-4'>
              {game.cover && (
                <img src={game.cover.url} alt={game.name} className='w-auto' />
              )}
              <div className='relative'>
                <h2 className='text-lg font-semibold mt-2'>{game.name}</h2>
                <div className='relative inline-block'>
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    className='icon w-6 h-6 cursor-pointer'
                    onClick={() => toggleMenu(game.id)}
                  />

                  {activeMenuId === game.id && (
                    <div className='absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10'>
                      {game.platforms && game.platforms.length > 0 ? (
                        game.platforms.map((platform) => (
                          <div
                            key={platform.id}
                            className='p-2 hover:bg-gray-100 cursor-pointer text-black'
                            onClick={() =>
                              alert(`Selected platform: ${platform.name}`)
                            }
                          >
                            {platform.name}
                          </div>
                        ))
                      ) : (
                        <p className='p-2 text-black'>No platforms available</p>
                      )}
                    </div>
                  )}
                </div>
                <FontAwesomeIcon
                  icon={faHeartCirclePlus}
                  className='icon w-6 h-6 cursor-pointer ml-2'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchGame;
