

// lib/userData.js

import { getToken } from './authenticate';

// This line is the fix. It directly uses the env variable.
const API_URL = process.env.NEXT_PUBLIC_API_URL; 

async function request(path, options = {}) {
  if (!API_URL) {
    console.error('NEXT_PUBLIC_API_URL is not set (lib/userData.js)');
    return [];
  }

  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; 
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 200) {
    try {
      return await res.json();
    } catch (err) {
      console.error('Failed to parse JSON from', path, err);
      return [];
    }
  } else {
    console.warn('userData request failed', res.status, res.statusText, `${API_URL}${path}`);
    return [];
  }
}

export async function addToFavourites(id) {
  return await request(`/favourites/${encodeURIComponent(id)}`, { method: 'PUT' });
}

export async function removeFromFavourites(id) {
  return await request(`/favourites/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function getFavourites() {
  return await request('/favourites', { method: 'GET' });
}

export async function addToHistory(id) {
  return await request(`/history/${encodeURIComponent(id)}`, { method: 'PUT' });
}

export async function removeFromHistory(id) {
  return await request(`/history/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function getHistory() {
  return await request('/history', { method: 'GET' });
}