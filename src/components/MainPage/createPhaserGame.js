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

  const config = {
    width: parentElement?.clientWidth || window.innerWidth,
    height: parentElement?.clientHeight || window.innerHeight,
    type: Phaser.AUTO,
    backgroundColor: "#242424",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: parentElement,
  };


  const game = new Phaser.Game(config);

  game.scene.add("Preload", Preload);
  game.scene.add("Level", Level);
  game.scene.add("Boot", Boot, true);

  return game;
};

export default createPhaserGame;
