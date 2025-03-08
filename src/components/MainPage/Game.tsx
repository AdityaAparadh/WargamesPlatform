import { useEffect, useRef } from "react";
import createPhaserGame from "./createPhaserGame.js";
import { usePage } from "../../hooks/usePage";
import { useAuth } from "../../hooks/useAuth";
import { useConfig } from "../../hooks/useConfig.js";
import { loadLevel } from "../../utils/levelLoader";
import { IoTrophy} from "react-icons/io5";
import { LuShell } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { SiKubernetes } from "react-icons/si";
import { MdLeaderboard } from "react-icons/md"; // Add this import
import "./GameUI.css";

const Game = () => {
  const phaserContainerRef = useRef(null);
  const { setCurrentPage } = usePage();
  const { username,token ,clearAuth } = useAuth();
  const { current_docker_level, current_score, current_rank } = useConfig();

  const handleLogout = () => {
    clearAuth();
    setCurrentPage('LoginPage');
  };

  const handleKubernetesClick = () => {
    setCurrentPage('KubernetesLevel');
  };

  const handleLeaderboardClick = () => {
    setCurrentPage('Leaderboard');
  };

  useEffect(() => {
    const game = createPhaserGame(phaserContainerRef.current);
    game.registry.set("currentDockerLevel", current_docker_level);

    const eventHandler = (e: CustomEvent) => {
      const parts = e.type.split("-");
      const lvl = parseInt(parts[2]);
      loadLevel(lvl,token ,setCurrentPage);
    };
    setTimeout(() => {
      if (game.canvas) {
        game.canvas.focus();
      }
    }, 100);
    for (let i = 1; i <= 20; i++) {
      window.addEventListener(`trigger-level-${i}`, eventHandler as EventListener);
    }

    return () => {
      for (let i = 1; i <= 20; i++) {
        window.removeEventListener(`trigger-level-${i}`, eventHandler as EventListener);
      }
      game.destroy(true);
      phaserContainerRef.current = null;
    };
  }, [setCurrentPage]);

  return (
    <div className="game-container">
      <div
        id="phaser-container"
        ref={phaserContainerRef}
        className="game-canvas"
      ></div>

      <div className="ui-layer">
        <div className="top-bar">
          <div className="stats-section">
            <div className="stat-item">
              <IoTrophy className="stat-icon" />
              <span>{current_rank == 0 ? "?" : current_rank}</span>
            </div>
            <div className="stat-item">
              <LuShell className="stat-icon" />
              <span>Score: {current_score}</span>
            </div>
          </div>
          <div className="user-section">
            <span className="user-email">{username}</span>
            <button onClick={handleLogout} className="logout-button">
              <FiLogOut className="button-icon" />
              Logout
            </button>
          </div>
        </div>

        <button
          onClick={handleLeaderboardClick}
          className="leaderboard-button"
        >
          <MdLeaderboard className="leaderboard-logo" />
        </button>

        <button
          onClick={handleKubernetesClick}
          className="k8s-button"
        >
          <SiKubernetes className="k8s-logo" />
        </button>
      </div>
    </div>
  );
};

export default Game;
