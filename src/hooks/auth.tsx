import React, { useState, useCallback, createContext, useContext } from 'react';
import api from '../services/api';

export interface UserData {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthRequestData {
  token: string;
  user: User;
}

interface AuthContextData {
  user: User;
  signIn(credentials: UserData): Promise<void>;
  signOut(): void;
  updateUser(updatedUser: User): void;
}

const AuthContext = createContext({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthRequestData>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }
    return {} as AuthRequestData;
  });

  const signIn = useCallback(async ({ email, password }: UserData): Promise<
    void
  > => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    const { user, token } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ user, token });
  }, []);

  const signOut = useCallback((): void => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthRequestData);
  }, []);

  const updateUser = useCallback(
    (user: User): void => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({ user, token: data.token });
    },
    [data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be use within an AuthContext');
  }

  return context;
};

export { AuthProvider, useAuth };
