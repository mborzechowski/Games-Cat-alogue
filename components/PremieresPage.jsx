'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isToday } from 'date-fns';
import Spinner from './Spinner';
import Image from 'next/image';
import WishlistButton from './WishlistButton';

const PremieresPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [gamesForSelectedDate, setGamesForSelectedDate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      setSelectedDate(today);

      try {
        const games = await fetchGamesForDate(today);
        setGamesForSelectedDate(games);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchData();
  }, []);

  const generateNextDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 14; i++) {
      const day = addDays(today, i);
      days.push(day);
    }

    return days;
  };

  const handleDayClick = async (day) => {
    setSelectedDate(day);
    const games = await fetchGamesForDate(day);
    setGamesForSelectedDate(games);
  };

  const fetchGamesForDate = async (selectedDate) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const requestBody = { query: 'someQuery', date: formattedDate };

    try {
      const response = await fetch('/api/getPremieres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const games = await response.json();
      console.log('Games fetched:', games);
      return games;
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  };

  const renderDays = () => {
    const days = generateNextDays();

    return (
      <div className='flex gap-4 flex-wrap overflow-x-auto scrollbar-none'>
        {days.map((day) => {
          const isInCurrentMonth = isToday(day);
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative bg-zinc-900 rounded-md w-auto h-auto flex items-start justify-start p-8 ${
                isInCurrentMonth ? 'text-red-600' : 'text-gray-300'
              }`}
            >
              <span className='absolute top-2 left-2 text-sm font-bold'>
                {format(day, 'dd.MM')}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGamesList = () => {
    if (loading)
      return (
        <div className='flex items-center justify-center w-full h-full'>
          <Spinner />
        </div>
      );

    if (gamesForSelectedDate.length === 0) {
      return <p>No games released on this day.</p>;
    }
    console.log(gamesForSelectedDate);

    return (
      <div>
        <h3 className='my-6 text-xl'>
          Games Released on {format(selectedDate, 'MMMM dd, yyyy')}
        </h3>
        <ul className='grid grid-cols-1 gap-4'>
          {gamesForSelectedDate.map((game, index) => (
            <li key={index} className='mb-4 flex gap-4 p-2 w-full'>
              <img
                src={
                  game.cover
                    ? game.cover.url.replace('t_thumb', 't_cover_big')
                    : '/temp_cover.png'
                }
                alt={game.name}
                className='w-1/4 md:w-1/6 rounded-md'
              />
              <div>
                <div className='font-bold '>
                  {game.name}
                  <WishlistButton game={game} />
                </div>

                <p>
                  <strong>Platform:</strong>{' '}
                  {game.platforms.length > 0 &&
                    game.platforms
                      .map((p, index) => <span key={index}>{p.name}</span>)
                      .reduce((prev, curr) => [prev, ', ', curr])}
                </p>
                <div className='hidden md:flex flex-col'>
                  {game.genres && game.genres.length > 0 && (
                    <div>
                      <strong>Genres:</strong>{' '}
                      {game.genres
                        .map((g, index) => <span key={index}>{g.name}</span>)
                        .reduce((prev, curr) => [prev, ', ', curr])}
                    </div>
                  )}
                  <div>
                    {game.summary && <strong>Summary:</strong>}
                    {game.summary}
                  </div>

                  {game.screenshots && game.screenshots.length > 0 && (
                    <div className='mt-4 '>
                      <h4 className='text-lg font-semibold'>Screenshots:</h4>
                      <div className='flex gap- flex-wrap'>
                        {game.screenshots
                          .slice(0, 5)
                          .map((screenshot, screenshotIndex) => (
                            <div
                              key={screenshotIndex}
                              className='relative w-32 h-32 flex-shrink-0'
                            >
                              <Image
                                src={`https:${screenshot.url.replace(
                                  't_thumb',
                                  't_screenshot_med'
                                )}`}
                                alt={`Screenshot ${screenshotIndex + 1}`}
                                width={120}
                                height={120}
                                className='rounded-md'
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className='p-4'>
      <h2 className='text-red-600 lg:mt-24 lg:mb-8 lg:text-xl mt-20 mb-8 lg:ml-0 text-lg ml-10'>
        Next Premieres
      </h2>
      <div className='flex flex-col gap-8'>
        <div className='w-full'>{renderDays()}</div>

        <div className='w-full'>{selectedDate && renderGamesList()}</div>
      </div>
    </div>
  );
};

export default PremieresPage;
