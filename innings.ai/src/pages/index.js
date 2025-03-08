import React from 'react';
import Head from 'next/head';
import LiveMatches from '../components/LiveMatches';
import { FaCricket, FaChartLine, FaCalendarAlt, FaUserFriends, FaTrophy } from 'react-icons/fa';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>CricketLive - Real-time Cricket Scores</title>
        <meta name="description" content="Get live cricket scores, match updates, and AI-powered predictions for cricket matches around the world." />
      </Head>
      
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Live Cricket Scores & Analysis</h1>
          <p className="text-lg opacity-90 mb-6 max-w-2xl">
            Follow live cricket matches with real-time updates, advanced statistics, and AI-powered predictions.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition-colors shadow-md">
              Live Matches
            </button>
            <button className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md">
              View Tournaments
            </button>
          </div>
        </div>
        
        {/* Featured Matches */}
        <LiveMatches />
        
        {/* Features Section */}
        <div className="mt-12 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
            Why Choose CricketLive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<FaCricket className="text-indigo-500" size={24} />}
              title="Real-Time Updates"
              description="Get ball-by-ball updates and live commentary for all international and major domestic cricket matches."
            />
            <FeatureCard 
              icon={<FaChartLine className="text-indigo-500" size={24} />}
              title="Advanced Analytics"
              description="Dive deep into match statistics, player performances, and historical data to understand the game better."
            />
            <FeatureCard 
              icon={<FaCalendarAlt className="text-indigo-500" size={24} />}
              title="Comprehensive Coverage"
              description="Follow matches across all formats - Tests, ODIs, T20Is, and major leagues like IPL, BBL, and more."
            />
            <FeatureCard 
              icon={<FaUserFriends className="text-indigo-500" size={24} />}
              title="Social Experience"
              description="Share your thoughts, create prediction leagues, and compete with friends for the ultimate cricket fan experience."
            />
            <FeatureCard 
              icon={<FaTrophy className="text-indigo-500" size={24} />}
              title="Tournament Tracking"
              description="Keep track of tournament points tables, team standings, and playoff scenarios all in one place."
            />
            <FeatureCard 
              icon={<FaBrain className="text-indigo-500" size={24} />}
              title="AI Match Predictions"
              description="Get advanced AI-powered predictions for match outcomes, player performances, and key turning points."
            />
          </div>
        </div>
      </div>
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default HomePage;