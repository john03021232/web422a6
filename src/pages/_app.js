

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import Layout from '../../components/Layout';
import RouteGuard from '../../components/RouteGuard';
import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '../store';
import { getFavourites, getHistory } from '../../lib/userData';
import { getToken } from '../../lib/authenticate';

export default function App({ Component, pageProps }) {
  const setFavourites = useSetAtom(favouritesAtom);
  const setSearchHistory = useSetAtom(searchHistoryAtom);

  useEffect(() => {
    // ADD THESE DEBUG LINES HERE:
    // console.log('🚀 DEBUG: API_URL in browser:', process.env.NEXT_PUBLIC_API_URL);
    // console.log('🔑 DEBUG: Current token:', getToken());

    async function loadInitialData() {
      // Check for a token first
      const token = getToken();

      // console.log('🔑 DEBUG: Token in loadInitialData:', token ? 'EXISTS' : 'MISSING');

      if (token) {
        // console.log('📡 DEBUG: About to call getFavourites and getHistory');
        const favourites = await getFavourites();
        const history = await getHistory();

        // console.log('📊 DEBUG: Got favourites:', favourites);
        // console.log('📊 DEBUG: Got history:', history);

        setFavourites(favourites);
        setSearchHistory(history);
      }
    }
    loadInitialData();
  }, [setFavourites, setSearchHistory]);

  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const res = await fetch(url);
          if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.');
            error.info = await res.json();
            error.status = res.status;
            throw error;
          }
          return res.json();
        },
      }}
    >
      <RouteGuard>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RouteGuard>
    </SWRConfig>
  );
}