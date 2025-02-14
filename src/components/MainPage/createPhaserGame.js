import * as Phaser from "phaser";
import Preload from "./scenes/Preload";
import Level from "./scenes/Level";

class Boot extends Phaser.Scene {
  preload() {
    this.load.pack("pack", "assets/preload-asset-pack.json");
  }
  create() {
    this.scene.start("Preload");
  }
}

export const createPhaserGame = (parentElement) => {
  console.log("Parent element:", parentElement);

  // Define fixed game inner resolution
  const innerWidth = 1280;
  const innerHeight = 720;

  // The internal game resolution remains fixed (1280×720).
  // Phaser.Scale.ENVELOP will automatically scale the canvas
  // so it completely covers the parent (even if parts get cropped),
  // and it will update on window resize.
  const config = {
    width: innerWidth,
    height: innerHeight,
    type: Phaser.AUTO,
    backgroundColor: "#242424",
    render: {
      antialias: true,  // enable smooth scaling (anti-aliasing)
      pixelArt: false   // disable pixelated rendering
    },
    scale: {
      mode: Phaser.Scale.ENVELOP,         // automatically scales to completely cover the parent
      autoCenter: Phaser.Scale.CENTER_BOTH, // center the game in the parent container
    },
    parent: parentElement,
  };


  const game = new Phaser.Game(config);

  game.scene.add("Preload", Preload);
  game.scene.add("Level", Level);
  game.scene.add("Boot", Boot, true);

  // Ensure the game canvas is focusable so keyboard events (e.g., arrow keys) work correctly.
  if (game.canvas) {
    game.canvas.setAttribute("tabindex", "0");
    game.canvas.focus();
    game.canvas.style.imageRendering = "auto";
  }

  // Capture arrow keys to prevent default browser behavior and ensure Phaser receives these inputs.
  if (game.input && game.input.keyboard) {
    game.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    ]);
  }

  // Optionally, reapply focus when the parent container is clicked.
  if (parentElement) {
    parentElement.addEventListener("click", () => {
      if (game.canvas) {
        game.canvas.focus();
      }
    });
  }

  // Reapply focus when the window gains focus – helps restore arrow key functionality after returning from terminal.
  const focusCallback = () => {
    if (game.canvas) {
      game.canvas.focus();
    }
  };
  window.addEventListener("focus", focusCallback);

  // When the game is destroyed, remove the window focus event listener to clean up
  if (game.events) {
    game.events.on('destroy', () => {
      window.removeEventListener("focus", focusCallback);
    });
  }

  // No need for manual updateZoom or window resize listener as Phaser.Scale.ENVELOP handles resizing automatically.

  return game;
};

export default createPhaserGame;
