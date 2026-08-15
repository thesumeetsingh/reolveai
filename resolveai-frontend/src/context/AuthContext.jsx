import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { login as loginRequest } from "../services/authService";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("resolveai-token")
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("resolveai-user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (credentials) => {
    const response = await loginRequest(credentials);

    const jwt =
      response.token ||
      response.accessToken ||
      response.jwt;

    if (!jwt) {
      throw new Error("JWT token was not returned by the server");
    }

    localStorage.setItem("resolveai-token", jwt);
    setToken(jwt);

    return response;
  };

  const logout = () => {
    localStorage.removeItem("resolveai-token");
    localStorage.removeItem("resolveai-user");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);

        localStorage.setItem(
          "resolveai-user",
          JSON.stringify(response.data)
        );
      } catch {
        logout();
      }
    };

    fetchCurrentUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}