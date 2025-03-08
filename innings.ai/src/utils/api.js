import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchLiveMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/matches`);
    return response.data;
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }
};

export const fetchMatchDetails = async (matchId) => {
  if (!matchId) return null;
  
  try {
    const response = await axios.get(`${API_URL}/matches?matchId=${matchId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching match details for ${matchId}:`, error);
    return null;
  }
};