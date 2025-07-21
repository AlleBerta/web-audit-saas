// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { UserResponse } from '@/types/user.types';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/server_response.types';
import { toast } from '@/hooks/use-toast';
import { SITE_NAME } from '@/config/conts';

type AuthContextType = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  fetchUser: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUserState, setAuthUserState] = useState<Omit<AuthContextType, 'fetchUser' | 'logout'>>(
    {
      user: null,
      isAuthenticated: false,
      loading: true, // per evitare Race Condition tra AuthContext e RequireAuth
    }
  );

  const fetchUser = async () => {
    try {
      const res = await api.get<ApiResponse<UserResponse>>('/user/current/', {
        withCredentials: true,
      });

      setAuthUserState((prev) => ({
        ...prev,
        user: {
          id: res.data.data.id,
          email: res.data.data.email,
          name: res.data.data.name,
          surname: res.data.data.surname,
          role: res.data.data.role,
        },
        isAuthenticated: true,
        loading: false,
      }));
    } catch (err) {
      setAuthUserState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        loading: false,
      }));
    }
  };

  const logout = async () => {
    try {
      const res = await api.put<ApiResponse<null>>('/user/logout');

      setAuthUserState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      toast({
        title: 'Bye Bye!',
        description: `Bye from ${SITE_NAME}`,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: 'Logout Error',
        description: 'Error during Logout',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authUserState,
        fetchUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return ctx;
};
