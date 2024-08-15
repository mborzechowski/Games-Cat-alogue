import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'Games Cat-alogue| Catalogue All Games',
  description: 'Catalogue All Your Games',
  keywords: 'games, catalogue',
};

export default function RootLayout({ children }) {
  return (
    <html lang='pl'>
      <body className='flex flex-row min-h-screen'>
        <NavBar />
        <main className='flex-grow w-full max-w-7xl mx-auto px-4'>
          {children}
        </main>
      </body>
    </html>
  );
}
