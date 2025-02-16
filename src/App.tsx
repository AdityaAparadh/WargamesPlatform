import { useEffect, useRef } from "react";
import axios from "axios";
import config from "../config.json";
import "./App.css";
import Game from "./components/MainPage/Game";
import DockerLevel from "./components/DockerLevel/DockerLevel";
import { usePage } from "./hooks/usePage";
import { useAuth } from "./hooks/useAuth";
import { useConfig } from "./hooks/useConfig";
import LoginPage from "./components/LoginPage/LoginPage";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import KubernetesLevel from "./components/KubernetesLevel/KubernetesLevel";
import LoadingPage from "./components/LoadingPage/LoadingPage";

function App() {
  const { currentPage, setCurrentPage } = usePage();
  const { token, username } = useAuth();
  const { 
    setCurrentScore, 
    setCurrentRank, 
    setLeaderboard, 
    setCurrentDockerLevel, 
    setCurrentKubeLevel 
  } = useConfig();
  
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const leaderboardIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleTerminalTrigger = (e: CustomEvent) => {
      console.log("Terminal trigger event received:", e.detail);
      setCurrentPage('DockerLevel');
    };
    window.addEventListener("terminal-trigger", handleTerminalTrigger as EventListener);
    return () => {
      window.removeEventListener("terminal-trigger", handleTerminalTrigger as EventListener);
    };
  }, [setCurrentPage]);

  useEffect(() => {
    if (!token) return;

    const updateStatus = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URI}/api/leaderboard/status`, {
          headers: { Authorization: token }
        });
        const { score, rank, currentdockerLevel, currentkubesLevel } = response.data;
        setCurrentScore(score);
        setCurrentRank(rank);
        setCurrentDockerLevel(currentdockerLevel);
        setCurrentKubeLevel(currentkubesLevel);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    updateStatus();
    statusIntervalRef.current = setInterval(updateStatus, config.UPDATE_TIMER * 1000);

    return () => {
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    };
  }, [token]);

  useEffect(() => {
    if (!token || !username) return;

    const updateLeaderboard = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URI}/api/leaderboard`);
        const { data } = response.data;
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    if (leaderboardIntervalRef.current) clearInterval(leaderboardIntervalRef.current);
    updateLeaderboard();
    leaderboardIntervalRef.current = setInterval(updateLeaderboard, config.UPDATE_TIMER * 1000);

    return () => {
      if (leaderboardIntervalRef.current) clearInterval(leaderboardIntervalRef.current);
    };
  }, [token, username]);

  const renderPage = () => {
    switch (currentPage) {
      case 'MainPage':
        return <Game />;
      case 'DockerLevel':
        return <DockerLevel onBack={() => setCurrentPage('MainPage')} />;
      case 'LoginPage':
        return <LoginPage />;
      case 'Leaderboard':
        return <Leaderboard />;
      case 'KubernetesLevel':
        return <KubernetesLevel />;
      case 'LoadingPage':
        return <LoadingPage />;
      default:
        return <Game />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
