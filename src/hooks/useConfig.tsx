import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LeaderboardEntry {
    username: string;
    score: number;
    rank: number;
}

interface ConfigContextType {
    leaderboard: LeaderboardEntry[];
    current_rank: number;
    current_docker_level: number;
    current_kube_level: number;
    current_score: number;
    setLeaderboard: (data: LeaderboardEntry[]) => void;
    setCurrentRank: (rank: number) => void;
    setCurrentDockerLevel: (level: number) => void;
    setCurrentKubeLevel: (level: number) => void;
    setCurrentScore: (score: number) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

/**
 * Context provider for useConfig
 */
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [leaderboard, setLeaderboardState] = useState<LeaderboardEntry[]>([]);
    const [current_rank, setCurrentRankState] = useState<number>(0);
    const [current_docker_level, setCurrentDockerLevelState] = useState<number>(1);
    const [current_kube_level, setCurrentKubeLevelState] = useState<number>(2);
    const [current_score, setCurrentScoreState] = useState<number>(0);

    // Memoize the setter functions to prevent unnecessary re-renders
    const setLeaderboard = useCallback((data: LeaderboardEntry[]) => {
        // Only update if data is actually different
        setLeaderboardState(prevData => {
            if (JSON.stringify(prevData) === JSON.stringify(data)) {
                return prevData;
            }
            return data;
        });
    }, []);
    
    const setCurrentRank = useCallback((rank: number) => {
        setCurrentRankState(prev => prev === rank ? prev : rank);
    }, []);
    
    const setCurrentDockerLevel = useCallback((level: number) => {
        setCurrentDockerLevelState(prev => prev === level ? prev : level);
    }, []);
    
    const setCurrentKubeLevel = useCallback((level: number) => {
        setCurrentKubeLevelState(prev => prev === level ? prev : level);
    }, []);
    
    const setCurrentScore = useCallback((score: number) => {
        setCurrentScoreState(prev => prev === score ? prev : score);
    }, []);

    const value = {
        leaderboard,
        current_rank,
        current_docker_level,
        current_kube_level,
        current_score,
        setLeaderboard,
        setCurrentRank,
        setCurrentDockerLevel,
        setCurrentKubeLevel,
        setCurrentScore
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

/**
 * @returns Custom hook for storing global config info
 */
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};




