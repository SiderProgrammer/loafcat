// TODO : change to container

export default class ProgressBar extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, maxFillValue, containerImage, fillImage }) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.containerImage = containerImage;
    this.fillImage = fillImage;
    this.maxFillValue = maxFillValue;

    this.barContainer = this.addBarContainer(0, 0);
    this.barFill = this.addBarFill(0, 0);

    this.add([this.barContainer, this.barFill]);
  }
  updatePosition(x, y) {
    this.barContainer.setPosition(x, y);
    this.barFill.setPosition(x + this.barContainer.displayWidth / 10, y);
  }

  setInvisible() {
    this.children.forEach((child) => child.setVisible(false));
  }

  setDepth(depth) {
    this.children.forEach((child) => child.setDepth(depth));
  }

  get children() {
    return [this.barContainer, this.barFill];
  }

  addBarContainer(x, y) {
    return this.scene.add.image(x, y, this.containerImage).setOrigin(0, 0.5);
  }

  addBarFill(x, y) {
    return this.scene.add.image(x, y, this.fillImage).setOrigin(0, 0.5);
  }

  isWidthAndHeightAdded() {
    return this.width && this.height;
  }

  setSize() {
    if (this.isWidthAndHeightAdded()) {
      this.barContainer.setDisplaySize(this.width + 20, this.height + 25);
      this.barFill.setDisplaySize(this.width, this.height);
    }
  }

  setScale() {
    if (this.scale) {
      this.barContainer.setScale(this.scale);
      this.barFill.setScale(this.scale);
    }
  }

  deactivate() {
    this.barContainer.setActive(false).setVisible(false);
    this.barFill.setActive(false).setVisible(false);
  }

  updateProgress(currentValue) {
    let valuePercentage = currentValue / this.maxFillValue;
    this.barFill.displayWidth *= valuePercentage;
  }

  getHealthPercent() {
    return this.health / this.maxHealth;
  }

  isOver() {
    return this.health <= 0;
  }

  destroy() {
    this.barContainer.destroy();
    this.barFill.destroy();
  }
}
