import { useEffect, useRef, useState, useCallback, memo } from "react";
import createPhaserGame from "./createPhaserGame.js";
import { usePage } from "../../hooks/usePage";
import { useAuth } from "../../hooks/useAuth";
import { useConfig } from "../../hooks/useConfig.js";
import { loadLevel } from "../../utils/levelLoader";
import { IoTrophy } from "react-icons/io5";
import { LuShell } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { SiKubernetes } from "react-icons/si";
import { MdLeaderboard } from "react-icons/md";
import GameModal from "../common/GameModal";
import "./GameUI.css";
import { LuBrain } from "react-icons/lu";

// Use memo to prevent unnecessary re-renders of the whole component
const Game = memo(
  () => {
    const phaserContainerRef = useRef(null);
    const gameInstanceRef = useRef(null);
    const { setCurrentPage } = usePage();
    const { username, token, clearAuth } = useAuth();
    const { current_docker_level, current_score, current_rank } = useConfig();

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    // Loading state - start with loading
    const [isLoading, setIsLoading] = useState(true);

    // Memoized event handlers to prevent recreation on each render
    const showModal = useCallback((message: string) => {
      setModalMessage(message);
      setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
      setModalOpen(false);
    }, []);

    const handleLogout = useCallback(() => {
      clearAuth();
      setCurrentPage("LoginPage");
    }, [clearAuth, setCurrentPage]);

    const handleKubernetesClick = useCallback(() => {
      setCurrentPage("KubernetesLevel");
    }, [setCurrentPage]);

    const handleLeaderboardClick = useCallback(() => {
      setCurrentPage("Leaderboard");
    }, [setCurrentPage]);

    // Setup event handlers - with optimized dependencies
    useEffect(() => {
      const eventHandler = (e: CustomEvent) => {
        const parts = e.type.split("-");
        const lvl = parseInt(parts[2]);
        loadLevel(lvl, token, setCurrentPage);
      };

      const messageHandler = (e: CustomEvent) => {
        if (e.detail && e.detail.message) {
          showModal(e.detail.message);
        }
      };

      // Register event handlers
      for (let i = 1; i <= 20; i++) {
        window.addEventListener(
          `trigger-level-${i}`,
          eventHandler as EventListener,
        );
      }
      window.addEventListener("game-message", messageHandler as EventListener);

      return () => {
        // Clean up event handlers
        for (let i = 1; i <= 20; i++) {
          window.removeEventListener(
            `trigger-level-${i}`,
            eventHandler as EventListener,
          );
        }
        window.removeEventListener(
          "game-message",
          messageHandler as EventListener,
        );
      };
    }, [token, setCurrentPage, showModal]); // Only the essentials

    // Optimized initialization effect
    useEffect(() => {
      // Skip if game is already created or we're missing critical data
      if (
        gameInstanceRef.current ||
        !token ||
        current_docker_level === undefined
      ) {
        return;
      }

      // Cleanup function reference
      let isMounted = true;

      // Attempt to initialize
      const initGame = () => {
        if (!phaserContainerRef.current || !isMounted) return;

        try {
          const game = createPhaserGame(phaserContainerRef.current);
          if (!isMounted) {
            game.destroy(true);
            return;
          }

          gameInstanceRef.current = game;
          game.registry.set("currentDockerLevel", current_docker_level);

          // Focus and hide loading with a small delay
          setTimeout(() => {
            if (game.canvas && isMounted) {
              game.canvas.focus();
              setIsLoading(false);
            }
          }, 100);
        } catch (error) {
          console.error("Failed to initialize Phaser game:", error);
          if (isMounted) setIsLoading(false);
        }
      };

      // Use requestAnimationFrame for better timing with the browser's render cycle
      requestAnimationFrame(initGame);

      return () => {
        isMounted = false;
        if (gameInstanceRef.current) {
          gameInstanceRef.current.destroy(true);
          gameInstanceRef.current = null;
        }
      };
    }, [token, current_docker_level]); // Minimal dependencies

    // Add debugging for render cycles
    useEffect(() => {
      console.log("Game component rendered");
    });

    return (
      <div className="game-container">
        <div
          id="phaser-container"
          ref={phaserContainerRef}
          className="game-canvas"
        ></div>

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading game world...</p>
          </div>
        )}

        <div className="ui-layer">
          <div className="top-bar">
            <div className="stats-section">
              <div className="stat-item">
                <IoTrophy className="stat-icon" />
                <span>{current_rank === 0 ? "?" : current_rank}</span>
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
            <MdLeaderboard className="k8s-logo" />
          </button>

          {/* <button
          onClick={handleKubernetesClick}
          className="k8s-button"
        > */}
          {/* <SiKubernetes className="k8s-logo" /> */}
          {/* <LuBrain className="k8s-logo" /> */}
          {/* </button> */}
        </div>

        {/* Modal for displaying messages */}
        <GameModal
          message={modalMessage}
          isOpen={modalOpen}
          onClose={closeModal}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // This function controls when the component re-renders
    // Returns true if the props are equal (don't re-render)
    // Since we have no props, always return true to prevent unnecessary re-renders
    return true;
  },
);

// Explicitly set the display name for better debugging
Game.displayName = "Game";

export default Game;
