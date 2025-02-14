import { useEffect, useRef } from "react";
import createPhaserGame from "./createPhaserGame.js";
import { usePage } from "../../hooks/usePage";
import { loadLevel } from "../../utils/levelLoader";

const Game = () => {
  const phaserContainerRef = useRef(null);
  const { setCurrentPage } = usePage();  

  useEffect(() => {
    const game = createPhaserGame(phaserContainerRef.current);

    // const handleResize = () => {
    //   const container = phaserContainerRef.current;
    //   if (container) {
    //     game.scale.resize(container.clientWidth, container.clientHeight);
    //   }
    // };
    // const resizeObserver = new ResizeObserver(handleResize);
    // if (phaserContainerRef.current) {
    //   resizeObserver.observe(phaserContainerRef.current);
    // }

    // Listen for trigger-level-{n} events; adjust the range as needed.
    const eventHandler = (e: CustomEvent) => {
      const parts = e.type.split("-");
      const lvl = parseInt(parts[2]);
      loadLevel(lvl, setCurrentPage);
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
      // resizeObserver.disconnect();
      for (let i = 1; i <= 20; i++) {
        window.removeEventListener(`trigger-level-${i}`, eventHandler as EventListener);
      }
      game.destroy(true);
      phaserContainerRef.current = null;
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
