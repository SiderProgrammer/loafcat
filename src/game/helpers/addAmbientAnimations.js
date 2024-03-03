export function addAmbientAnimations(scene, map) {
    if (map === "livingRoomMap") {
        scene.add.sprite(0, 0, "TV-egyptian-loaf").play("TV-egyptian-loaf");
        scene.add.sprite(0, 0, "TV-lamp").play("TV-lamp");
    }
}
