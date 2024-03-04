export function addAmbientAnimations(scene, map) {
    if (map === "livingRoomMap") {
        scene.add.sprite(439, 253, "TV-egyptian-loaf").play("TV-egyptian-loaf");
        scene.add
            .sprite(343, 261, "TV-lamp")
            .setAlpha(0.5)
            .setDepth(3)
            .play("TV-lamp");
    }
}
