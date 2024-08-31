'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const LibraryPage = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch('/api/getLibrary');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGames(data);
      } catch (err) {
        console.error('Error fetching library:', err);
        setError('Failed to load library.');
      }
    };

    fetchLibrary();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Your Library</h1>
      {games.length === 0 ? (
        <p>No games found in your library.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game._id}>
              <h2>{game.title}</h2>
              <img src={game.cover_image} alt={game.title} />
              {/* <p>Rating: {game.rating}</p>
              <p>Status: {game.status}</p>
              <p>Personal Notes: {game.personal_notes}</p>
              <p>Platforms: {game.platforms.map((p) => p.name).join(', ')}</p>
              <p>Genres: {game.genres.map((g) => g.name).join(', ')}</p> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LibraryPage;
