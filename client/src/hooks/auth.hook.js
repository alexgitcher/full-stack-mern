import { useState, useCallback, useEffect } from "react";

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);

    try {
      localStorage.setItem(storageName, JSON.stringify({
        userId: id,
        token: jwtToken,
      }));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);

    try {
      localStorage.removeItem(storageName);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userId);
    }

    setReady(true);
  }, [login]);

  return {
    login,
    logout,
    token,
    userId,
    ready,
  };
};
