import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    username: string | null;
    token: string | null;
    setAuth: (username: string, token: string) => void;
    clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Context for storing user auth info
 */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [username , setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const setAuth = (username: string, token: string) => {
        setUsername(username);
        setToken(token);
    };

    const clearAuth = () => {
        setUsername(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ username , token, setAuth, clearAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook for storing user auth info and accessing it globally
 * @returns The user auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
