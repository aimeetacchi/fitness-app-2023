"use client"

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const getAuthToken = async (token: string) =>  {
  console.log(token)
  try {
    const url = `https://www.strava.com/oauth/token?client_id=112054&client_secret=ec4b3e27394f7311a2e95a58248047421995aa10&code=${token}&grand_type=authorization_code`;
    const response = await fetch(url, {
      method: 'POST'
    });

    const data = await response.json();
    console.log('Response:', data);
    const { access_token, refresh_token, name, city } = data;
    return { 
      access_token,
      refresh_token,
      name,
      city,
    };
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};


const getData = async (token: string) => {
  console.log(token)
  try {
    const url = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
    const response = await fetch(url, {
      method: 'GET'
    });

    const data = await response.json();
    console.log('Response athlete data:', data);
    return data;

  } catch (error) {
    console.error('Error:', error);
    return error;
  }
}

export default function Home() {
  const [token, setToken] = useState<string|null>(null);
  const [resToken, setResponseToken] = useState<string|null>(null);
  const [responseData, setResponseData] = useState({})

  const router = useRouter();
  const searchParams = useSearchParams()
  useEffect(() => {
    console.log('route changed')
    console.log(searchParams)
    const code = searchParams.get('code');
    setToken(code)
    
    if (code) {
      const fetchData = async () => {
        const res: any = await getAuthToken(code);
        console.log('data:', res);
        setResponseToken(res?.access_token); // Store the response in state
      };
      fetchData();
    }

  }, [router, searchParams]);


  useEffect(() => {
    if (resToken) {
      console.log('calling the strava data api --', resToken)
      const fetchData = async () => {
        const res = await getData(resToken);
        console.log('data:', res);
        setResponseData(JSON.stringify(res)); // Store the response in state
      };
      fetchData();
    }
  }, [resToken])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-2 rounded-sm bg-lime-500"
            href="http://www.strava.com/oauth/authorize?client_id=112054&redirect_uri=http://localhost:3000&response_type=code&scope=activity:read_all"
          >
           Connect
          </a>
      </div>
    </main>
  )
}
