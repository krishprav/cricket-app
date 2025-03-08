import React, { useState, useEffect } from 'react';
import { parseScorecard } from '../utils/formatters';

const Scorecard = ({ matchData }) => {
  const [scorecardData, setScorecardData] = useState(null);
  const [activeTeam, setActiveTeam] = useState(0);
  
  useEffect(() => {
    if (matchData && matchData.scorecard) {
      const { batting = [], bowling = [] } = matchData.scorecard;
      const parsedData = parseScorecard(batting, bowling);
      setScorecardData(parsedData);
      
      // Set active team to the one currently batting
      if (parsedData && parsedData.teams.length > 0) {
        // Determine which team is likely batting now
        // This is a simplistic approach; in a real app you'd have more structured data
        const lastBattingEntry = batting[batting.length - 1] || '';
        const team1Name = parsedData.teams[0];
        const team2Name = parsedData.teams[1];
        
        if (lastBattingEntry.includes(team1Name)) {
          setActiveTeam(0);
        } else if (lastBattingEntry.includes(team2Name)) {
          setActiveTeam(1);
        }
      }
    }
  }, [matchData]);
  
  if (!scorecardData || !scorecardData.teams || scorecardData.teams.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Scorecard</h3>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  const { teams, scorecard } = scorecardData;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          {teams.map((team, index) => (
            <button
              key={index}
              className={`px-6 py-4 text-center font-medium text-sm flex-1 transition-all
                ${activeTeam === index 
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
              onClick={() => setActiveTeam(index)}
            >
              {team}
              {scorecard[team]?.score && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {scorecard[team].score.runs}/{scorecard[team].score.wickets}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-4">
        {teams[activeTeam] && scorecard[teams[activeTeam]] && (
          <div>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Batting
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Batter
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        R
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        B
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        4s
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        6s
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        SR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {scorecard[teams[activeTeam]].batting.map((batter, idx) => (
                      <tr key={idx} className={batter.runs >= 50 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                          {batter.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-semibold text-gray-800 dark:text-gray-200">
                          {batter.runs}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {batter.balls}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {batter.fours}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {batter.sixes}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {batter.strikeRate}
                        </td>
                      </tr>
                    ))}
                    
                    {scorecard[teams[activeTeam]].batting.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                          No batting data available yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Bowling
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Bowler
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        O
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        M
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        R
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        NB
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        WD
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ECO
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {scorecard[teams[activeTeam]].bowling.map((bowler, idx) => (
                      <tr key={idx} className={bowler.wickets >= 3 ? 'bg-green-50 dark:bg-green-900/10' : ''}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                          {bowler.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {bowler.overs}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {bowler.maidens}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {bowler.runs}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-semibold text-gray-800 dark:text-gray-200">
                          {bowler.wickets}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {bowler.noBalls}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {bowler.wides}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {bowler.economy}
                        </td>
                      </tr>
                    ))}
                    
