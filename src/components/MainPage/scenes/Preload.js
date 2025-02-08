import * as Phaser from "phaser";
import PreloadBarUpdaterScript from "../scripts/PreloadBarUpdaterScript";

export default class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  editorPreload() {
    const assetPackPath = process.env.NODE_ENV === "production" 
      ? "assets/asset-pack.json" 
      : "public/assets/asset-pack.json";
    this.load.pack("asset-pack", assetPackPath);
  }

  editorCreate() {
    this.add.image(505, 360, "guapen").setScale(0.327);

    const progressBarBg = this.add.rectangle(553, 361, 256, 20, 0x444444);
    progressBarBg.setOrigin(0, 0);

    const progressBar = this.add.rectangle(553, 361, 256, 20, 0xdddddd);
    progressBar.setOrigin(0, 0);
    
    const loadingText = this.add.text(552, 329, "Loading...", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#e0e0e0",
    });

    new PreloadBarUpdaterScript(this, progressBar).awake();
  }

  preload() {
    this.editorPreload();

    this.editorCreate();

    this.load.on(Phaser.Loader.Events.COMPLETE, () => {
      this.scene.start("Level");
    });
  }
}
