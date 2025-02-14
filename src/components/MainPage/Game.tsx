import { useEffect, useRef } from "react";
import createPhaserGame from "./createPhaserGame.js";
const Game = () => {
  const phaserContainerRef = useRef(null);

  useEffect(() => {
    const game = createPhaserGame(phaserContainerRef.current);

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

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      game.destroy(true);
    };
  }, []);

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
