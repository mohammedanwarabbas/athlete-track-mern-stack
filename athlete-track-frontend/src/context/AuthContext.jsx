// description: This code defines an authentication context for managing user login, registration, and profile updates in a React application. It uses cookies to persist user data across sessions and provides functions to set authentication data, update user profiles, and log out users.
// This uses normal cookie to store jwt , use httponly cookies for sensitive data
import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null); // { id, role, username, token }

  /*
  structure of usrdata and token coming from backend for athlete:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdhNDM1MmVlOWM0NDU1ZTQ1MTVlNDEiLCJyb2xlIjoiYXRobGV0ZSIsImlhdCI6MTc1Mjg4NzI2MCwiZXhwIjoxNzUzNDkyMDYwfQ.2rGwmkXIEvLh1KVCO4ZHGGTXsjnce79NCkzpUarrvO0",
  "user": {
    "_id": "687a4352ee9c4455e4515e41",
    "email": "vijay@gmail.com",
    "password": "$2b$12$qfSamTPetZbzKcAxFha0suYxneCGl7MfyoJLkZ2dyoLxrQ62PW2.W",
    "role": "athlete",
    "name": "vijay joseph",
    "height": null,
    "weight": null,
    "createdAt": "2025-07-18T12:51:30.759Z",
    "updatedAt": "2025-07-18T12:51:30.759Z",
    "__v": 0
  }
}
   structure of usrdata and token coming from backend for admin:
  {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODcyYjEwY2M3MjIxMTRkMTEwODhhZGEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI4ODczNDgsImV4cCI6MTc1MzQ5MjE0OH0.5EJljrhg7GChi9PZVbbRq0STd0tUGvufl_VDNd6mMws",
  "user": {
    "_id": "6872b10cc722114d11088ada",
    "email": "admin@gmail.com",
    "password": "$2b$12$6wbfpf3.7WwmqhSeQkJV7.GscU8f/Ox9G8ztASzBfZCVFMLdc/xp2",
    "role": "admin",
    "name": "Don",
    "createdAt": "2025-07-12T19:01:32.330Z",
    "updatedAt": "2025-07-12T19:14:21.755Z",
    "__v": 0
  }
}

      */
  // Login/register will call this after API success
  const setAuthData = (userData, token) => {
    // user data in cookies
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify(userData), { expires: 7 });
    // Set user data in state for (browser refresh resets state,so we use cookies)
    setUser({ ...userData, token }); // Store token in context
  };

  // updateprofile.jsx will call this after API success
  const updateUserData = (updatedUserData) => {
    // Update user data in cookies
    const currentUserData = JSON.parse(Cookies.get("user") || {});
    const newUserData = {
      ...currentUserData, //ex: {id,role,name,height}
      ...updatedUserData, //ex:email/name/height/weight
    };

    Cookies.set("user", JSON.stringify(newUserData), { expires: 7 });
    // Update user data in state
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  // set initial state from cookies if cookies are present
  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");

    if (token && userData) {
      try {
        setUser({ ...JSON.parse(userData), token });
      } catch (err) {
        console.error("Failed to parse user data from cookies", err);
        Cookies.remove("user");
        Cookies.remove("token");
      }
    }
  }, []);

  const logout = () => {
    // Clear everything
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setAuthData, updateUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}