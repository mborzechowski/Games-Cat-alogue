'use client';

import { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import GameList from './GameList';

const SearchGame = () => {
  const [query, setQuery] = useState('');
  const [developerName, setDeveloperName] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeGameDetails, setActiveGameDetails] = useState(null);

  const toggleMenu = (gameId) => {
    if (activeMenuId === gameId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(gameId);
    }
  };

  const toggleGameDetails = (game) => {
    if (activeGameDetails?.id === game.id) {
      setActiveGameDetails(null);
    } else {
      setActiveGameDetails(game);
    }
  };

  const igdbSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.post(
        '/api/igdb',
        { query, developerName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setGames(response.data);
    } catch (error) {
      setError('An error occurred during the search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col lg:mt-48 mt-24 gap-8'>
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={igdbSearch}
        loading={loading}
        developerName={developerName}
        setDeveloperName={setDeveloperName}
      />

      {error && <p>{error}</p>}

      {hasSearched && games.length === 0 && !loading && <p>No games found.</p>}

      <GameList
        games={games}
        activeMenuId={activeMenuId}
        toggleMenu={toggleMenu}
        activeGameDetails={activeGameDetails}
        toggleGameDetails={toggleGameDetails}
      />
    </div>
  );
};

export default SearchGame;
