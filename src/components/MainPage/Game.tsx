import { useEffect, useRef } from "react";
import createPhaserGame from "./createPhaserGame.js";

const Game = () => {
  const phaserContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    // Create Phaser game with the container ref.
    const game = createPhaserGame(phaserContainerRef.current);
    gameRef.current = game;

    // Delay a little to allow Phaser to fully initialize and its canvas be rendered,
    // then force focus so keyboard events are captured.
    setTimeout(() => {
      if (game.canvas) {
        game.canvas.focus();
      }
    }, 100);

    return () => {
      // Properly destroy the Phaser game instance so that all event listeners (including window focus callbacks) are removed.
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      gameRef.current = null;
    };
  }, []);

  return (
    // Ensure the container has explicit dimensions
    <div 
      ref={phaserContainerRef} 
      className="game-container" 
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default Game;
