'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const PlayerStats = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/libraryStats`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error('Error fetching library stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [session]);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>No stats available.</p>;

  return (
    <div className='bg-black text-white p-4 rounded-lg'>
      <h2 className='text-2xl font-bold mb-4'>Library Stats</h2>
      <p>
        <strong>Total Games:</strong> {stats.totalGames}
      </p>
      <p>
        <strong>Total Genres:</strong> {stats.totalGenres}
      </p>
      <p>
        <strong>Genres:</strong>{' '}
        {stats.genres.length > 0
          ? stats.genres.join(', ')
          : 'No genres available'}
      </p>
      <p>
        <strong>Total Publishers:</strong> {stats.totalPublishers}
      </p>
      <p>
        <strong>Publishers:</strong>{' '}
        {stats.publishers.length > 0
          ? stats.publishers.join(', ')
          : 'No publishers available'}
      </p>
      <p>
        <strong>Total Platforms:</strong> {stats.totalPlatforms}
      </p>
      <p>
        <strong>Platforms:</strong>{' '}
        {stats.platforms.length > 0
          ? stats.platforms.join(', ')
          : 'No platforms available'}
      </p>
      <p>
        <strong>Average Rating:</strong>{' '}
        {stats.averageRating !== null
          ? stats.averageRating
          : 'No ratings available'}
      </p>
      <p>
        <strong>Newest Game:</strong> {stats.newestGame || 'No games available'}
      </p>
    </div>
  );
};

export default PlayerStats;
