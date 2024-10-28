'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import Spinner from '@/components/Spinner';

const PlayerStats = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const genreChartRef = useRef(null);
  const publisherChartRef = useRef(null);
  const platformChartRef = useRef(null);
  const ratingChartRef = useRef(null);

  const genreChartInstance = useRef(null);
  const publisherChartInstance = useRef(null);
  const platformChartInstance = useRef(null);
  const ratingChartInstance = useRef(null);

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

  useEffect(() => {
    if (!stats) return;

    // Sortowanie danych i inicjalizacja wykresów
    const initDoughnutChart = (chartInstance, ref, data, labels) => {
      if (chartInstance.current) chartInstance.current.destroy();
      chartInstance.current = new Chart(ref.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                '#991b1b',
                '#F93000',
                '#FA0600',
                '#FA640A',
                '#FA5753',
              ],
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          cutout: '45%',
        },
      });
    };

    // Wykres kołowy dla gatunków
    const sortedGenres = Object.entries(stats.genresCount).sort(
      (a, b) => b[1] - a[1]
    );
    initDoughnutChart(
      genreChartInstance,
      genreChartRef,
      sortedGenres.map((item) => item[1]),
      sortedGenres.map((item) => item[0])
    );

    // Wykres kołowy dla wydawców
    const sortedPublishers = Object.entries(stats.publishersCount).sort(
      (a, b) => b[1] - a[1]
    );
    initDoughnutChart(
      publisherChartInstance,
      publisherChartRef,
      sortedPublishers.map((item) => item[1]),
      sortedPublishers.map((item) => item[0])
    );

    // Wykres kołowy dla platform
    const sortedPlatforms = Object.entries(stats.platformsCount).sort(
      (a, b) => b[1] - a[1]
    );
    initDoughnutChart(
      platformChartInstance,
      platformChartRef,
      sortedPlatforms.map((item) => item[1]),
      sortedPlatforms.map((item) => item[0])
    );

    // Wykres słupkowy dla ocen
    if (ratingChartInstance.current) ratingChartInstance.current.destroy();
    ratingChartInstance.current = new Chart(ratingChartRef.current, {
      type: 'bar',
      data: {
        labels: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
        datasets: [
          {
            label: 'Games Count by Rating',
            data: stats.ratings,
            backgroundColor: '#991b1b',
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } },
      },
    });

    // Czyszczenie wykresów przy odmontowaniu komponentu
    return () => {
      if (genreChartInstance.current) genreChartInstance.current.destroy();
      if (publisherChartInstance.current)
        publisherChartInstance.current.destroy();
      if (platformChartInstance.current)
        platformChartInstance.current.destroy();
      if (ratingChartInstance.current) ratingChartInstance.current.destroy();
    };
  }, [stats]);

  if (loading)
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner loading={loading} className='' />
      </div>
    );
  if (!stats) return <p>No stats available.</p>;

  return (
    <div className='bg-none text-white p-4 rounded-lg mt-4 '>
      <h2 className='text-2xl font-semibold mb-4'>Library Stats</h2>

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 w-full sm:w-1/2'>
          <div className='flex mb-6 gap-2'>
            <div className='bg-black p-6 rounded-lg text-center h-32 w-full'>
              <p className='text-lg font-bold text-red-800'>Total Games</p>
              <p className='text-2xl text-red-800'>{stats.totalGames}</p>
            </div>
            <div className='bg-black p-6 rounded-lg text-center h-32 w-full'>
              <p className='text-lg font-bold text-red-800'>Total Genres</p>
              <p className='text-2xl text-red-800'>{stats.totalGenres}</p>
            </div>
          </div>
          <div className='bg-black px-8 py-4 rounded-lg text-center h-32'>
            <p className='text-lg font-bold mt-6 text-red-800'>Newest Game:</p>
            <p className='text-red-800'>
              {stats.newestGame || 'No games available'}
            </p>
          </div>
        </div>

        {/* Bar Chart: Ratings Distribution */}
        <div className='flex flex-col w-full sm:w-1/2'>
          <h3 className='text-xl font-bold mb-2'>Ratings</h3>
          <div className='mb-6'>
            <canvas ref={ratingChartRef} className='w-full h-64' />{' '}
            {/* Ustalamy wysokość wykresu */}
          </div>
        </div>
      </div>

      <div className='sm:flex sm:mt-10 h-full'>
        {/* Wykres kołowy: Popularne gatunki */}
        <h3 className='text-xl font-semibold mb-2'>Genres</h3>
        <div className='mb-6 sm:max-w-[40%]'>
          <canvas ref={genreChartRef} />
        </div>

        {/* Wykres kołowy: Popularni wydawcy */}
        <h3 className='text-xl font-bold mb-2'>Publishers</h3>
        <div className='mb-6 sm:max-w-[40%]'>
          <canvas ref={publisherChartRef} />
        </div>

        {/* Wykres kołowy: Popularne platformy */}
        <h3 className='text-xl font-bold mb-2'>Platforms</h3>
        <div className='mb-6 sm:max-w-[40%]'>
          <canvas ref={platformChartRef} />
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
