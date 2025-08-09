
// components/RouteGuard.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '../lib/userData';
import { isAuthenticated, readToken } from '../lib/authenticate';

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState(readToken());

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    // This is the core function for updating the Jotai atoms.
    const updateAtoms = async () => {
      setFavouritesList(await getFavourites());
      setSearchHistory(await getHistory());
    };

    const PUBLIC_PATHS = ['/', '/login', '/register', '/_error'];
    const pathIsPublic = PUBLIC_PATHS.includes(router.pathname);

    // Only update atoms if a token exists.
    if (token) {
      updateAtoms();
    }

    if (!token && !pathIsPublic) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router, token, setFavouritesList, setSearchHistory]); // Jotai setters are stable, so you can add them.

  useEffect(() => {
    const checkToken = () => {
      setToken(readToken());
    };

    // Listen for token changes in local storage
    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  return authorized ? children : null;
}
