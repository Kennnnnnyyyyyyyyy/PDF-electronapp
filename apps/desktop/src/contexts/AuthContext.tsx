import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../api/auth';

interface AuthContextType {
    user: AuthResponse | null;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = authApi.getStoredUser();
        if (storedUser && authApi.isAuthenticated()) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (data: LoginRequest) => {
        const response = await authApi.login(data);
        setUser(response);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response));
    };

    const register = async (data: RegisterRequest) => {
        const response = await authApi.register(data);
        setUser(response);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response));
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
