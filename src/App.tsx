import { useEffect, useRef, useState, useCallback } from "react";
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
import DebugPage from "./components/DebugPage/DebugPage";

function App() {
  const { currentPage, setCurrentPage } = usePage();
  const { token, username } = useAuth();
  const {
    setCurrentScore,
    setCurrentRank,
    setLeaderboard,
    setCurrentDockerLevel,
    setCurrentKubeLevel,
  } = useConfig();

  // Add loading state to wait for initial data fetching
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Single ref for all data fetching to prevent race conditions
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Track if we're currently fetching to prevent overlapping requests
  const isFetchingRef = useRef(false);
  // Track fetch attempts to prevent infinite loops
  const initialFetchAttemptedRef = useRef(false);
  // Debug counter for leaderboard updates
  const updateCountRef = useRef(0);

  // Terminal trigger handler
  const handleTerminalTrigger = useCallback((e: CustomEvent) => {
    console.log("Terminal trigger event received:", e.detail);
    setCurrentPage("DockerLevel");
  }, [setCurrentPage]);

  // Set up event listener for terminal triggers
  useEffect(() => {
    window.addEventListener(
      "terminal-trigger",
      handleTerminalTrigger as EventListener,
    );
    return () => {
      window.removeEventListener(
        "terminal-trigger",
        handleTerminalTrigger as EventListener,
      );
    };
  }, [handleTerminalTrigger]);

  // Combined data fetching function to ensure consistency
  const fetchAllData = useCallback(async (isInitialFetch = false) => {
    // Prevent overlapping requests
    if (isFetchingRef.current || !token) {
      return;
    }
    
    try {
      isFetchingRef.current = true;
      
      // Log update count for debugging
      updateCountRef.current++;
      console.log(`Data fetch #${updateCountRef.current} started`);
      
      // Fetch status data
      const statusResponse = await axios.get(`${config.BACKEND_URI}/info/status`, {
        headers: { Authorization: token },
      });
      
      const { score, rank, currentdockerLevel, currentkubesLevel } = statusResponse.data;
      setCurrentScore(score);
      setCurrentRank(rank);
      setCurrentDockerLevel(currentdockerLevel);
      setCurrentKubeLevel(currentkubesLevel);
      
      // Only fetch leaderboard if we have a username (authenticated)
      if (username) {
        const leaderboardResponse = await axios.get(`${config.BACKEND_URI}/info/leaderboard`);
        const { data } = leaderboardResponse.data;
        setLeaderboard(data);
      }
      
      // Mark as initialized on first fetch
      if (isInitialFetch) {
        setIsInitialized(true);
      }
      
      console.log(`Data fetch #${updateCountRef.current} completed successfully`);
    } catch (error) {
      console.error(`Data fetch #${updateCountRef.current} failed:`, error);
      if (isInitialFetch) {
        // Even on error, proceed after initial attempt
        setIsInitialized(true);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [
    token, 
    username, 
    setCurrentScore, 
    setCurrentRank, 
    setCurrentDockerLevel, 
    setCurrentKubeLevel, 
    setLeaderboard
  ]);

  // Single effect for all data fetching
  useEffect(() => {
    // Clear any existing timer
    if (fetchTimerRef.current) {
      clearInterval(fetchTimerRef.current);
      fetchTimerRef.current = null;
    }
    
    if (!token) {
      setIsInitialized(true);
      return;
    }
    
    // Initial fetch on mount or token/username change
    if (!initialFetchAttemptedRef.current) {
      initialFetchAttemptedRef.current = true;
      fetchAllData(true);
    }
    
    // Set up a single interval for all data updates
    const intervalMs = config.UPDATE_TIMER * 1000;
    console.log(`Setting up data fetch interval: ${intervalMs}ms`);
    
    fetchTimerRef.current = setInterval(() => {
      fetchAllData(false);
    }, intervalMs);
    
    return () => {
      console.log("Cleaning up data fetch interval");
      if (fetchTimerRef.current) {
        clearInterval(fetchTimerRef.current);
        fetchTimerRef.current = null;
      }
    };
  }, [token, username, fetchAllData]);

  // Memoized page renderer to prevent unnecessary re-renders
  const renderPage = useCallback(() => {
    // If not initialized yet and we need authentication, show loading
    if (!isInitialized && token) {
      return <LoadingPage />;
    }
    
    // Once initialized or if no token needed, proceed to render appropriate page
    switch (currentPage) {
      case "MainPage":
        return <Game />;
      case "DockerLevel":
        return <DockerLevel onBack={() => setCurrentPage("MainPage")} />;
      case "LoginPage":
        return <LoginPage />;
      case "Leaderboard":
        return <Leaderboard />;
      case "KubernetesLevel":
        return <KubernetesLevel />;
      case "LoadingPage":
        return <LoadingPage />;
      case "DebugPage":
        return <DebugPage />;
      default:
        return <Game />;
    }
  }, [currentPage, isInitialized, token, setCurrentPage]);

  return <>{renderPage()}</>;
}

export default App;
