import { useEffect, useRef } from "react";
import createPhaserGame from "./createPhaserGame.js";

const Game = () => {
  const phaserContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create Phaser game with the container ref.
    const game = createPhaserGame(phaserContainerRef.current);

    return () => {
      // Optionally perform any game cleanup here.
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
