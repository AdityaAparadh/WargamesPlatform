import { useEffect, useRef } from "react";
import createPhaserGame from "./createPhaserGame.js";
import { usePage } from "../../hooks/usePage";
import { loadLevel } from "../../utils/levelLoader";

const Game = () => {
  const phaserContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  // const phaserContainerRef = useRef(null);
  const { setCurrentPage } = usePage();  

  useEffect(() => {
    const game = createPhaserGame(phaserContainerRef.current);
    gameRef.current = game;

    // Delay a little to allow Phaser to fully initialize and its canvas be rendered,
    // then force focus so keyboard events are captured.
    setTimeout(() => {
      if (game.canvas) {
        game.canvas.focus();
      }
    }, 100);

    const handleResize = () => {
      const container = phaserContainerRef.current;
      if (container) {
        game.scale.resize(container.clientWidth, container.clientHeight);
      }
    };

    // Add ResizeObserver for the container
    const resizeObserver = new ResizeObserver(handleResize);
    if (phaserContainerRef.current) {
      resizeObserver.observe(phaserContainerRef.current);
    }

    // Listen for trigger-level-{n} events; adjust the range as needed.
    const eventHandler = (e: CustomEvent) => {
      const parts = e.type.split("-");
      const lvl = parseInt(parts[2]);
      loadLevel(lvl, setCurrentPage);
    };
    for (let i = 1; i <= 20; i++) {
      window.addEventListener(`trigger-level-${i}`, eventHandler as EventListener);
    }

    return () => {
      // Properly destroy the Phaser game instance so that all event listeners (including window focus callbacks) are removed.
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      gameRef.current = null;
      resizeObserver.disconnect();
      for (let i = 1; i <= 20; i++) {
        window.removeEventListener(`trigger-level-${i}`, eventHandler as EventListener);
      }
      game.destroy(true);
    };
  }, [setCurrentPage]);

  return (
    <div
      id="phaser-container"
      ref={phaserContainerRef}
      style={{ 
        position: 'absolute',
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}
    ></div>
  );
};

export default Game;
