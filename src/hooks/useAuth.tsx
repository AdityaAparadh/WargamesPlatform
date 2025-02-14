import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    email: string | null;
    token: string | null;
    setAuth: (email: string, token: string) => void;
    clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Context for storing user auth info
 */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const setAuth = (email: string, token: string) => {
        setEmail(email);
        setToken(token);
    };

    const clearAuth = () => {
        setEmail(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ email, token, setAuth, clearAuth }}>
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
