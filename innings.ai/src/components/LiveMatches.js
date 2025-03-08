import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchLiveMatches } from '../utils/api';

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getMatches = async () => {
      try {
        setLoading(true);
        const data = await fetchLiveMatches();
        setMatches(data);
      } catch (err) {
        setError('Failed to load matches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    getMatches();
    
    // Refresh every 2 minutes
    const interval = setInterval(getMatches, 120000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-2xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (matches.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">No Live Matches</h3>
          <p className="text-gray-600 dark:text-gray-400">There are no live cricket matches currently. Check back later!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Live Matches
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.matchId || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/match/${match.matchId}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-4 cursor-pointer border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                      {match.teams}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{match.score}</p>
                  </div>
                  
                  <div>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold 
                      ${match.status?.toLowerCase().includes('live') 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {match.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LiveMatches;