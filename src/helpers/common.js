import { GameModel } from "../models/GameModel";

export async function fadeOut(scene, duration = 1000) {
  return new Promise((resolve) => {
    if (!scene.blackOverlay) {
      scene.blackOverlay = scene.add
        .image(
          GameModel.GAME_WIDTH / 2,
          GameModel.GAME_HEIGHT / 2,
          "blackBackground"
        )
        .setDepth(99999)
        .setAlpha(0)
        .setVisible(false)
        .setDisplaySize(GameModel.GAME_WIDTH, GameModel.GAME_HEIGHT);
    }

    scene.tweens.add({
      targets: scene.blackOverlay,
      alpha: 1,
      duration,
      onComplete: resolve,
    });
  });
}
export async function fadeIn(scene, duration = 1000) {
  return new Promise((resolve) => {
    const bg = scene.blackOverlay;

    scene.tweens.add({
      targets: bg,
      alpha: 0,
      duration,
      onComplete: resolve,
    });
  });
}
