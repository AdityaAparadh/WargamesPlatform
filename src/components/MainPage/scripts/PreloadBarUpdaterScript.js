export default class PreloadBarUpdaterScript {
  constructor(scene, gameObject) {
    this.scene = scene;
    this.gameObject = gameObject;
  }

  awake() {
    const fullWidth = this.gameObject.width;
    this.scene.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
      this.gameObject.width = fullWidth * progress;
    });
  }
}
