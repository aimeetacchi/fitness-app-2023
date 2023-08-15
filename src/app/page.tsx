"use client";

import { useGetAuthToken } from "@/services/fetchStravaAccessToken";
import { useGetStravaData } from "@/services/getStravaData";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [fetched, setFetched] = useState(false);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { data, error, isLoading } = useGetAuthToken(code, fetched);

  // const [token, setToken] = useState<string|null>(null);
  const [resToken, setResponseToken] = useState<string | null>(null);

  useEffect(() => {
    if (data?.access_token && !fetched) {
      setResponseToken(data?.access_token); // Store the response in state
      setFetched(true); // Set fetched to true to prevent the query from running again
    }
  }, [data, fetched]);

  const { data: responseData, isLoading: isLoadingData } =
    useGetStravaData(resToken);
  console.log("responseData", responseData);

  if (!code) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <a
            className="pointer-events-auto w-40 text-center p-8 lg:p-2 rounded-sm bg-lime-500"
            href="http://www.strava.com/oauth/authorize?client_id=112054&redirect_uri=http://localhost:3000&response_type=code&scope=activity:read_all"
          >
            Connect
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm ">
        <Link href="/about">About</Link>
        {isLoading || isLoadingData ? (
          <p>Loading...</p>
        ) : responseData && Array.isArray(responseData) ? (
          <>
            <h1 className="text-lg mb-4">Welcome to your Strava Dashboard!</h1>
            {responseData.map((item: any) => (
              <div className="border p-2" key={item.id}>
                <p>{item.name}</p>
              </div>
            ))}
          </>
        ) : (
          <p>Error or empty response. Try to Connect again.</p>
        )}
      </div>
    </main>
  );
}
