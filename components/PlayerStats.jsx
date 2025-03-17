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
  const platformChartRef = useRef(null);
  const ratingChartRef = useRef(null);

  const genreChartInstance = useRef(null);
  const platformChartInstance = useRef(null);
  const ratingChartInstance = useRef(null);

  const [changingDiv, setChangingDiv] = useState(true);
  const [fade, setFade] = useState(true);

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
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setChangingDiv((prev) => !prev);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!stats) return;

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
          cutout: '55%',
        },
      });
    };

    // Wykres kołowy dla gatunków
    const sortedGenres = Object.entries(stats.genresCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    const otherSortedGenres = Object.entries(stats.genresCount)
      .slice(20)
      .reduce((acc, entry) => acc + entry[1], 0);

    if (otherSortedGenres > 0) {
      sortedGenres.push(['Others', otherSortedGenres]);
    }
    initDoughnutChart(
      genreChartInstance,
      genreChartRef,
      sortedGenres.map((item) => item[1]),
      sortedGenres.map((item) => item[0])
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
      if (platformChartInstance.current)
        platformChartInstance.current.destroy();
      if (ratingChartInstance.current) ratingChartInstance.current.destroy();
    };
  }, [stats]);

  if (!session) {
    return <h2 className='text-red-600 mt-96'>Login to see your stats</h2>;
  }

  if (loading)
    return (
      <div className='flex items-center justify-center h-full mt-40 sm:mt-0'>
        <Spinner loading={loading} className='' />
      </div>
    );
  if (!stats) return <p>No stats available.</p>;

  // Obliczanie liczby gier fizycznych i cyfrowych
  const physicalCount = stats.physicalGames || 0;
  const digitalCount = stats.digitalGames || 0;
  const totalCount = physicalCount + digitalCount;
  const physicalPercentage =
    totalCount > 0 ? (physicalCount / totalCount) * 100 : 0;
  const digitalPercentage =
    totalCount > 0 ? (digitalCount / totalCount) * 100 : 0;

  // Funkcja do generowania listy najwyższych wyników
  const getTopResults = (data, count = 5) => {
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([label, value]) => ({ label, value }));
  };

  // Najczęstsze gatunki
  const topGenres = getTopResults(stats.genresCount);
  // Najczęstsze platformy
  const topPlatforms = getTopResults(stats.platformsCount);

  return (
    <div className='bg-none text-white p-4 rounded-lg mt-4 '>
      <h2 className='text-red-600 mt-20 sm:mt-10 lg:text-xl mb-8 lg:ml-0 text-lg ml-10'>
        Library Stats
      </h2>

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 w-full sm:w-1/2'>
          <div className='flex mb-6 gap-2'>
            <div className='bg-black p-4 rounded-lg text-center h-28 w-auto'>
              <p className='text-lg font-semibold text-red-800'>Total Games</p>
              <p className='text-2xl font-bold text-red-800'>
                {stats.totalGames}
              </p>
            </div>
            <div className='bg-black p-4 rounded-lg text-center h-28 w-auto'>
              <p className='text-lg font-semibold text-red-800'>Total Genres</p>
              <p className='text-2xl font-bold text-red-800'>
                {stats.totalGenres}
              </p>
            </div>
            <div className='bg-black p-4 rounded-lg text-center h-28 w-auto'>
              <p className='text-lg font-semibold text-red-800'>
                Finished Games
              </p>
              <p className='text-2xl font-bold text-red-800'>
                {stats.completedGamesCount}
              </p>
            </div>
          </div>
          <div
            className={`bg-black py-4 rounded-lg text-center h-32 sm:w-96 transition-opacity duration-1000 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {changingDiv ? (
              <>
                <p className='text-lg font-bold mt-6 text-red-800'>
                  New in Catalogue:
                </p>
                <p className='text-red-800'>
                  {stats.newestGame || 'No games available'}
                </p>
              </>
            ) : (
              <>
                <p className='text-lg font-bold mt-6 text-red-800'>
                  Oldest Game in Catalogue:
                </p>
                <p className='text-red-800'>
                  {stats.oldestGame || 'No games available'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className='flex flex-col w-full sm:w-1/2'>
          <h3 className='text-xl font-bold mb-2'>Ratings</h3>
          <div className='mb-6'>
            <canvas ref={ratingChartRef} className='w-full h-64' />{' '}
          </div>
        </div>
      </div>

      <h3 className='text-xl font-bold my-2'>Games Medium</h3>
      <div className='relative bg-black rounded-lg p-4 mt-4'>
        <div className='flex justify-between'>
          <span className='text-red-800'>{physicalCount} Physical</span>
          <span className='text-red-800'>{digitalCount} Digital</span>
        </div>
        <div className='w-full flex  h-4'>
          <div
            className='h-full'
            style={{
              width: `${physicalPercentage}%`,
              backgroundColor: 'red',
            }}
          ></div>
          <div
            className='h-full'
            style={{
              width: `${digitalPercentage}%`,
              backgroundColor: 'darkred',
            }}
          ></div>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-8 mt-10'>
        {/* Sekcja z wykresami i listami */}
        <div className='flex-1'>
          {/* Wykres kołowy: Popularne gatunki */}
          <h3 className='text-xl font-semibold mb-2'>Genres</h3>
          <div className='flex gap-20'>
            <div className='w-1/3'>
              <canvas ref={genreChartRef} />
            </div>
            <div className='w-1/2 mt-8'>
              <h4 className='text-lg font-bold mb-2'>Top Genres</h4>
              <ul className='list-disc pl-5'>
                {topGenres.map((genre, index) => (
                  <li key={index} className='text-red-800'>
                    <strong>{genre.label}</strong> | {/* Separator */}
                    <span className='text-white'>{genre.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Wykres kołowy: Popularne platformy */}
          <h3 className='text-xl font-bold mt-6 mb-2'>Platforms</h3>
          <div className='flex gap-20'>
            <div className='w-1/3'>
              <canvas ref={platformChartRef} />
            </div>
            <div className='w-1/2 mt-8'>
              <h4 className='text-lg font-bold mb-2'>Top Platforms</h4>
              <ul className='list-disc pl-5'>
                {topPlatforms.map((platform, index) => (
                  <li key={index} className='text-red-800'>
                    <strong>{platform.label}</strong> | {/* Separator */}
                    <span className='text-white'>{platform.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
