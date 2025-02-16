import { createContext, useContext, useState, ReactNode } from 'react';

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

    const setLeaderboard = (data: LeaderboardEntry[]) => setLeaderboardState(data);
    const setCurrentRank = (rank: number) => setCurrentRankState(rank);
    const setCurrentDockerLevel = (level: number) => setCurrentDockerLevelState(level);
    const setCurrentKubeLevel = (level: number) => setCurrentKubeLevelState(level);
    const setCurrentScore = (score: number) => setCurrentScoreState(score);

    return (
        <ConfigContext.Provider
            value={{
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
            }}
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




