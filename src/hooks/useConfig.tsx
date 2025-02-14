import { createContext, useContext, useState, ReactNode } from 'react';

interface LeaderboardEntry {
    username: string;
    score: number;
    rank: number;
}

interface ConfigContextType {
    leaderboard: LeaderboardEntry[];
    current_rank: number;
    current_level: string;
    setLeaderboard: (data: LeaderboardEntry[]) => void;
    setCurrentRank: (rank: number) => void;
    setCurrentLevel: (level: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

/**
 * Context provider for useConfig
 */
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [leaderboard, setLeaderboardState] = useState<LeaderboardEntry[]>([]);
    const [current_rank, setCurrentRankState] = useState<number>(0);
    const [current_level, setCurrentLevelState] = useState<string>('');

    const setLeaderboard = (data: LeaderboardEntry[]) => setLeaderboardState(data);
    const setCurrentRank = (rank: number) => setCurrentRankState(rank);
    const setCurrentLevel = (level: string) => setCurrentLevelState(level);

    return (
        <ConfigContext.Provider
            value={{ leaderboard, current_rank, current_level, setLeaderboard, setCurrentRank, setCurrentLevel }}
        >
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
