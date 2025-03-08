import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Component {...pageProps} />
        </main>
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="container mx-auto px-4">
            © {new Date().getFullYear()} CricketLive - Real-time cricket scores and analysis
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;