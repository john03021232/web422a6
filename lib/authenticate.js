// lib/authenticate.js
import {jwtDecode} from "jwt-decode";



export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
}

export function readToken() {
  const token = getToken();
  return token ? jwtDecode(token) : null;
}

export function isAuthenticated() {
  const token = readToken();
  return token ? token.exp > Math.floor(Date.now() / 1000) : false;
}


// Login API call
export async function authenticateUser(user, password) {
  try {
     console.log("Attempting login with:", user); // Debug log
    const res = await fetch("https://user-api-30bj.onrender.com/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: user, password }),
    });


    // console.log("Response status:", res.status); // Debug log
    // console.log("Response ok:", res.ok); // Debug log

    const data = await res.json();

    // console.log("Response data:", data); // Debug log

    if (res.status === 200) {
      setToken(data.token);
      return true;
    } else {
      throw new Error(data.message || 'Invalid login credentials');
    }
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}




// Register API call
export async function registerUser(user, password, password2) {
    try {
        const res = await fetch("https://user-api-30bj.onrender.com/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: user, password, password2 }),
        });

        if (res.status === 200) {
            return true;
        } else {
            const data = await res.json();
            throw new Error(data.message || "Registration failed");
        }
    } catch (err) {
        console.error("Registration error:", err);
        throw err;
    }
}




