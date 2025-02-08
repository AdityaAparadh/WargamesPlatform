import { useEffect, useRef } from "react";
import createPhaserGame from "./createPhaserGame";

const Game = () => {
  const phaserContainerRef = useRef(null);

  useEffect(() => {
    const game = createPhaserGame(phaserContainerRef.current);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      id="phaser-container"
      ref={phaserContainerRef}
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
};

export default Game;
