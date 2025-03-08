import { useState, useEffect } from 'react';
import { fetchMatchDetails } from '../utils/api';
import useWebSocket from './useWebSocket';

const useMatchData = (matchId) => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Connect to WebSocket for real-time updates
  const { data: wsData, isConnected } = useWebSocket(matchId);
  
  // Initial data fetch
  useEffect(() => {
    const getMatchData = async () => {
      try {
        setLoading(true);
        const data = await fetchMatchDetails(matchId);
        if (data) {
          setMatchData(data);
        } else {
          setError('No match data available');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error in useMatchData:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (matchId) {
      getMatchData();
    }
  }, [matchId]);
  
  // Update data when WebSocket sends new information
  useEffect(() => {
    if (wsData && Object.keys(wsData).length > 0) {
      setMatchData(wsData);
    }
  }, [wsData]);
  
  return { matchData, loading, error, isLive: isConnected };
};

export default useMatchData;