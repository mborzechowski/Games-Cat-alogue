'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const LibraryPage = () => {
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session || status === 'loading') return;

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
  }, [session, status]);

  if (status === 'loading') {
    return <div className='text-red-600 mt-96'>Loading...</div>;
  }

  if (!session) {
    return <h2 className='text-red-600 mt-96'>Login to see your library</h2>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className='text-red-600 mt-48 mb-8 text-xl'>Your Library</h1>
      {games.length === 0 ? (
        <p>No games found in your library.</p>
      ) : (
        <div className='grid grid-cols-10 gap-4'>
          {games.map((game) => (
            <div key={game._id}>
              <img src={game.cover_image} alt={game.title} />
              {/* <p>Rating: {game.rating}</p>
              <p>Status: {game.status}</p>
              <p>Personal Notes: {game.personal_notes}</p>
              
              <p>Genres: {game.genres.map((g) => g.name).join(', ')}</p> */}
              <h2>{game.title}</h2>
              <p>Platform: {game.platforms.map((p) => p.name).join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
