'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isToday } from 'date-fns';
import Spinner from './Spinner';
import Image from 'next/image';
import WishlistButton from './WishlistButton';
import PremieresList from './_PremieresPage/PremieresList';

const PremieresPage = () => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [gamesForSelectedDate, setGamesForSelectedDate] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(selectedDate);

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
    setSelectedDate(format(day, 'yyyy-MM-dd'));
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
          const formattedDay = format(day, 'yyyy-MM-dd');
          const isSelected = formattedDay === selectedDate;

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative w-auto h-auto flex items-center justify-center p-4 cursor-pointer hover:text-red-600 border-b-2 ${
                isSelected
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <span className=' text-sm font-bold'>{format(day, 'dd.MM')}</span>
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

    return (
      <PremieresList
        selectedDate={selectedDate}
        gamesForSelectedDate={gamesForSelectedDate}
      ></PremieresList>
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
