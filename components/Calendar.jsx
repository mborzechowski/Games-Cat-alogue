'use client';

import { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [gamesForSelectedDate, setGamesForSelectedDate] = useState([]);

  //   const handlePrevMonth = () => {
  //     setCurrentMonth(subMonths(currentMonth, 1));
  //   };

  //   const nextMonth = () => {
  //     setCurrentMonth(addMonths(currentMonth, 1));
  //   };

  //   const fetchGamesForDate = async (selectedDate) => {
  //     const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  //     console.log('Formatted Date:', formattedDate);
  //     try {
  //       const response = await fetch('/api/igdb', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ releaseDate: formattedDate }),
  //       });
  //       const games = await response.json();
  //       return games;
  //     } catch (error) {
  //       console.error('Error fetching games:', error);
  //       return [];
  //     }
  //   };

  //   const handleDayClick = async (day) => {

  //     const fullDate = new Date(day);
  //     setSelectedDate(fullDate);
  //     console.log('Selected Date:', fullDate);

  //     const games = await fetchGamesForDate(fullDate);
  //     setGamesForSelectedDate(games);
  //   };

  //   const renderHeader = () => {
  //     return (
  //       <div className='flex justify-between items-center mb-6'>
  //         <button onClick={handlePrevMonth} className='text-xl font-bold'>
  //           &lt;
  //         </button>
  //         <h2 className='text-2xl font-bold'>
  //           {format(currentMonth, 'MMMM yyyy')}
  //         </h2>
  //         <button onClick={nextMonth} className='text-xl hover:text-gray-500'>
  //           &gt;
  //         </button>
  //       </div>
  //     );
  //   };

  //   const renderDays = () => {
  //     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  //     return (
  //       <div className='grid grid-cols-7 gap-4 text-center font-bold'>
  //         {days.map((day, index) => (
  //           <div key={index} className='text-gray-600'>
  //             {day}
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   };

  //   const renderCells = () => {
  //     const monthStart = startOfMonth(currentMonth);
  //     const monthEnd = endOfMonth(monthStart);
  //     const startDate = startOfWeek(monthStart);
  //     const endDate = endOfWeek(monthEnd);

  //     const rows = [];
  //     let days = [];
  //     let day = startDate;

  //     while (day <= endDate) {
  //       for (let i = 0; i < 7; i++) {
  //         const isInCurrentMonth = isSameMonth(day, monthStart);
  //         const isToday = isSameDay(day, new Date());

  //         days.push(
  //           <div
  //             key={day}
  //             onClick={() => handleDayClick(day)}
  //             className={`relative bg-zinc-700 p-4 rounded-md h-32 flex items-start justify-start ${
  //               isInCurrentMonth ? 'text-red-600' : 'text-gray-400'
  //             } ${isToday ? 'border border-red-600' : ''}`}
  //           >
  //             <span className='absolute top-1 left-1 text-xs font-bold'>
  //               {format(day, 'd')}
  //             </span>
  //           </div>
  //         );
  //         day = addDays(day, 1);
  //       }
  //       rows.push(
  //         <div className='grid grid-cols-7 gap-4 mb-4' key={day}>
  //           {days}
  //         </div>
  //       );
  //       days = [];
  //     }

  //     return <div>{rows}</div>;
  //   };

  //   const renderGamesList = () => {
  //     if (gamesForSelectedDate.length === 0) {
  //       return <p>No games released on this day.</p>;
  //     }

  //     return (
  //       <div>
  //         <h3 className='mt-6 text-xl font-bold'>
  //           Games Released on {format(selectedDate, 'MMMM dd, yyyy')}
  //         </h3>
  //         <ul>
  //           {gamesForSelectedDate.map((game, index) => (
  //             <li key={index} className='mb-4'>
  //               <div className='font-bold'>{game.name}</div>
  //               <div>{game.summary}</div>
  //               <img
  //                 src={game.cover?.url}
  //                 alt={game.name}
  //                 className='mt-2 w-32'
  //               />
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     );
  //   };

  //   return (
  //     <div className='p-4'>
  //       {renderHeader()}
  //       {renderDays()}
  //       {renderCells()}
  //       {selectedDate && renderGamesList()}
  //     </div>
  //   );
  // };

  const generateNextDays = () => {
    const today = new Date();
    const days = [];

    // Generujemy 10 dni, zaczynając od dzisiaj
    for (let i = 0; i < 30; i++) {
      const day = addDays(today, i);
      days.push(day);
    }

    return days;
  };

  // Funkcja obsługująca kliknięcie na dzień
  const handleDayClick = async (day) => {
    setSelectedDate(day); // Ustawiamy wybraną datę
    const games = await fetchGamesForDate(day); // Pobieramy gry dla wybranego dnia
    setGamesForSelectedDate(games); // Ustawiamy pobrane gry w stanie
  };

  const fetchGamesForDate = async (selectedDate) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    console.log('Formatted Date:', formattedDate); // Logowanie daty przed wysłaniem

    const requestBody = { query: 'someQuery', date: formattedDate }; // Przekazanie daty jako 'date'
    console.log('Request Body:', requestBody); // Logowanie całego ciała zapytania

    try {
      const response = await fetch('/api/igdb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Przesyłamy sformatowaną datę
      });

      const games = await response.json();
      console.log('Games fetched:', games); // Logowanie odpowiedzi z API
      return games;
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  };

  // Funkcja renderująca dni
  const renderDays = () => {
    const days = generateNextDays(); // Generujemy dni

    return (
      <div className='grid grid-cols-1 gap-4'>
        {days.map((day) => {
          const isInCurrentMonth = isToday(day); // Sprawdzamy, czy to dzisiaj
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative bg-zinc-700 p-4 rounded-md h-32 w-32 flex items-start justify-start ${
                isInCurrentMonth ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              <span className='absolute top-1 left-1 text-xs font-bold'>
                {format(day, 'd')} {/* Wyświetlamy dzień miesiąca */}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Funkcja renderująca listę gier
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
                src={game.cover?.url}
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
      <h2 className='text-2xl font-bold mb-6'>Next 10 Days</h2>
      {renderDays()} {/* Renderowanie dni */}
      {selectedDate && renderGamesList()}{' '}
      {/* Renderowanie gier po wybraniu dnia */}
    </div>
  );
};

export default Calendar;
