import { useEffect } from "react";
import "./App.css";
import Game from "./components/MainPage/Game";
import DockerLevel from "./components/DockerLevel/DockerLevel";
import { usePage } from "./hooks/usePage";
import LoginPage from "./components/LoginPage/LoginPage";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import KubernetesLevel from "./components/KubernetesLevel/KubernetesLevel";
import LoadingPage from "./components/LoadingPage/LoadingPage";

function App() {
  const { currentPage, setCurrentPage } = usePage();

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
  return <>{renderPage()}</>;
}

export default App;
