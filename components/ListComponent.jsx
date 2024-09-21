'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Lists = () => {
  const [activeTab, setActiveTab] = useState('Wishlist');
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGames = async (listType) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/getLibrary?list=${encodeURIComponent(listType)}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGames(data);
    } catch (err) {
      console.error('Error fetching library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || status === 'loading') {
      return;
    }
    fetchGames(activeTab);
  }, [activeTab, session, status]);

  const tabs = ['Wishlist', 'Next in line', 'On loan', 'On hold', 'On sale'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Wishlist':
      case 'Next in line':
      case 'On loan':
      case 'On hold':
      case 'On sale':
        return (
          <div className='grid grid-cols-10 gap-8'>
            {games.map((game) => (
              <div key={game._id} className='relative group cursor-pointer'>
                <img
                  src={game.cover_image}
                  alt={game.title}
                  className='rounded-lg'
                />
                <div className='absolute left-1/2 transform -translate-x-1/2 mt-2 w-max px-2 py-1 bg-black text-red-600 text-center text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
                  {game.title}
                </div>
                <h2></h2>
              </div>
            ))}
          </div>
        );
      default:
        return <div>Select a tab to see content.</div>;
    }
  };

  return (
    <div className='mt-44'>
      <div className='flex gap-4 '>
        {tabs.map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 -mb-px  text-xl border-b-2 ${
              activeTab === tabName
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-600'
            } hover:text-red-600`}
          >
            {tabName}
          </button>
        ))}
      </div>

      {session ? (
        <div className='mt-4 p-4'>{renderContent()}</div>
      ) : (
        <h2 className='text-red-600 mt-44'>Login to see your list</h2>
      )}
    </div>
  );
};

export default Lists;
