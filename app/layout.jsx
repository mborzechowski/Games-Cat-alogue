import './globals.css';
import NavBar from '@/components/NavBar';
import AuthProvider from '@/components/AuthProvider';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Slide } from 'react-toastify';

export const metadata = {
  title: 'Games Cat-a-logue| Catalogue All Games',
  description: 'Catalogue All Your Games',
  keywords: 'games, catalogue',
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang='pl'>
        <body className='flex flex-col md:flex-row min-h-screen font-sans '>
          <NavBar />
          <ToastContainer
            theme='dark'
            autoClose={2500}
            transition={Slide}
            toastStyle={{ width: '400px' }}
          />
          <main className='flex-grow w-full max-w-7xl mx-auto px-8'>
            {children}
          </main>
        </body>
      </html>
    </AuthProvider>
  );
}
