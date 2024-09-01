'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const LibraryList = () => {
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

      <div className='grid grid-cols-10 gap-8'>
        {games.map((game) => (
          <div key={game._id} className='relative group cursor-pointer'>
            <img
              src={game.cover_image}
              alt={game.title}
              className='rounded-lg'
            />
            {/* <p>Rating: {game.rating}</p>
              <p>Status: {game.status}</p>
              <p>Personal Notes: {game.personal_notes}</p>
              
              <p>Genres: {game.genres.map((g) => g.name).join(', ')}</p> */}
            <div class='absolute left-1/2 transform -translate-x-1/2 mt-2 w-max px-2 py-1 bg-black text-red-600 text-center text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
              {game.title}
              <p className='text-gray-400 text-center'>
                {' '}
                {game.platforms.map((p) => p.name).join(', ')}
              </p>
            </div>
            <h2></h2>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LibraryList;
