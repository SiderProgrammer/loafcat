export default class UsableItem extends Phaser.GameObjects.Image {
    constructor(scene, pointer) {
        super(scene, pointer.worldX, pointer.worldY);
        this.scene = scene;
        scene.add.existing(this);
        this.setTexture("apple");

        this.isInUse = false;
        this.itemData = null;

        this.setVisible(false);
    }

    take(textureKey, itemData) {
        this.setTexture(textureKey);
        this.setDepth(2);
        this.isInUse = true;
        this.itemData = itemData;
        this.setVisible(true);
    }

    put() {
        this.setVisible(false);
        this.isInUse = false;
        // this.itemData = null;
    }
}
