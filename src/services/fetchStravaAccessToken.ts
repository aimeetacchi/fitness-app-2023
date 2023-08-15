import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAuthToken = (token: string | null, fetched: boolean) => {
    return useQuery(
      ['getAuthToken', token],
      async () => {
        const { data } = await axios.post(`https://www.strava.com/oauth/token?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET}&code=${token}&grant_type=authorization_code`);
        return data;
      },
      { enabled: !!token && !fetched } // The query will not run until the token is available and not fetched
    );
};
  
  
  
  
  
  