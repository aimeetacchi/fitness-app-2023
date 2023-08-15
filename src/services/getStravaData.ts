import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const useGetStravaData = (token: string | null) => {
  return useQuery(
    ['getStravaData', token], // Unique key and token as part of the query key
    async () => {
      const url = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
      const { data } = await axios.get(url);
      return data;
    },
    { enabled: !!token } // The query will not run until the token is available
  );
};