'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isToday } from 'date-fns';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [gamesForSelectedDate, setGamesForSelectedDate] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      setSelectedDate(today);

      try {
        const games = await fetchGamesForDate(today);
        setGamesForSelectedDate(games);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchData();
  }, []);

  const generateNextDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 30; i++) {
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
      <div className='grid grid-cols-1 gap-4'>
        {days.map((day) => {
          const isInCurrentMonth = isToday(day);
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative bg-zinc-700 p-4 rounded-md h-32 w-32 flex items-start justify-start ${
                isInCurrentMonth ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              <span className='absolute top-1 left-1 text-xs font-bold'>
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGamesList = () => {
    if (gamesForSelectedDate.length === 0) {
      return <p>No games released on this day.</p>;
    }
    console.log(gamesForSelectedDate);

    return (
      <div>
        <h3 className='mt-6 text-xl font-bold'>
          Games Released on {format(selectedDate, 'MMMM dd, yyyy')}
        </h3>
        <ul>
          {gamesForSelectedDate.map((game, index) => (
            <li key={index} className='mb-4'>
              <div className='font-bold'>{game.name}</div>
              <div>{game.summary}</div>
              <img
                src={
                  game.cover
                    ? game.cover.url.replace('t_thumb', 't_cover_big')
                    : '/temp_cover.png'
                }
                alt={game.name}
                className='mt-2 w-32'
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-6'>Next Premieres</h2>
      <div className='flex gap-0'>
        {/* Kontener renderDays */}
        <div className='w-1/3'>{renderDays()}</div>

        {/* Kontener renderGamesList */}
        <div className='w-2/3'>{selectedDate && renderGamesList()}</div>
      </div>
    </div>
  );
};

export default Calendar;
