import React from 'react';
import Link from 'next/link';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 backdrop-blur bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
              Cricket<span className="text-amber-500">Live</span>
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="text-amber-400 text-xl" />
            ) : (
              <FaMoon className="text-indigo-600 text-xl" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;