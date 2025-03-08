import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocket = (matchId) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
    
    if (!WS_URL || !matchId) return;
    
    wsRef.current = new WebSocket(WS_URL);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
      
      // Subscribe to match updates
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        matchId: matchId
      }));
    };
    
    wsRef.current.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    
    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
    
    wsRef.current.onerror = (err) => {
      setError(err);
      console.error('WebSocket error:', err);
    };
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [matchId]);
  
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);
  
  return { data, isConnected, error };
};

export default useWebSocket;