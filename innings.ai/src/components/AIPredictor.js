import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { predictMatchOutcome, predictPlayerOfMatch } from '../utils/aiPredictor';

const AIPredictor = ({ matchData }) => {
  const [prediction, setPrediction] = useState(null);
  const [potm, setPotm] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (matchData) {
      setLoading(true);
      
      // Simulate AI processing delay
      const timer = setTimeout(() => {
        const matchPrediction = predictMatchOutcome(matchData);
        setPrediction(matchPrediction);
        
        const playerPrediction = predictPlayerOfMatch(matchData);
        setPotm(playerPrediction);
        
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [matchData]);
  
  if (!matchData) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex items-center mb-4">
        <FaBrain className="text-indigo-600 dark:text-indigo-400 mr-2 text-xl" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">AI Match Predictor</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="text-indigo-600 dark:text-indigo-400 animate-spin text-2xl" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Analyzing match data...</span>
        </div>
      ) : (
        <div>
          {prediction && prediction.winningTeam ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="border-l-4 border-indigo-500 pl-4 py-2 mb-4"
            >
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {prediction.prediction}
              </p>
              
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Win Probability</span>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {prediction.confidence}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>50/50</span>
                  <span>Confident</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-4 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Insufficient data for match prediction
              </p>
            </div>
          )}
          
          {prediction && prediction.factors && prediction.factors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <FaChartLine className="mr-1" /> Key Factors
              </h4>
              <ul className="text-sm space-y-1">
                {prediction.factors.map((factor, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5 mr-2"></span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {potm && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Projected Player of the Match
              </h4>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 rounded">
                <div className="font-medium text-indigo-700 dark:text-indigo-300">
                  {potm.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {potm.performance} • {potm.reason}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <FaInfoCircle className="mr-1" />
            Predictions update in real-time as the match progresses
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPredictor;