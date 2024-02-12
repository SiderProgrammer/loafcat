export function linkTilemaps(scene, map) {
  if (map === "streetMap") {
    const streetTileset = scene.map.addTilesetImage("mp_cs_tilemap_all");
    scene.map.createLayer("Background", streetTileset);
    scene.map.createLayer("Tile Layer 5", streetTileset);
    scene.map.createLayer("Tile Layer 2", streetTileset);

    scene.map.createLayer("Tile Layer 3", streetTileset);
    scene.map.createLayer("Tile Layer 4", streetTileset);
  } else if (map === "kitchenMap") {
    const kitchenTileset = scene.map.addTilesetImage("Kitchen Room");
    const kitchenTileset2 = scene.map.addTilesetImage("Bathroom");
    const kitchenTileset3 = scene.map.addTilesetImage("Chill Room");
    const kitchenTileset4 = scene.map.addTilesetImage("Background");
    const kitchenTileset5 = scene.map.addTilesetImage("mp_cs_tilemap_all");
    const tilesets = [
      kitchenTileset,
      kitchenTileset2,
      kitchenTileset3,
      kitchenTileset4,
      kitchenTileset5,
    ];
    scene.map.createLayer("Tile Layer 1", tilesets);
    scene.map.createLayer("Tile Layer 2", tilesets);
    scene.map.createLayer("Tile Layer 3", tilesets);
    scene.map.createLayer("Tile Layer 4", tilesets);
  } else if (map === "chillRoomMap") {
    const kitchenTileset2 = scene.map.addTilesetImage("Bathroom");
    const kitchenTileset3 = scene.map.addTilesetImage("Chill Room");
    const kitchenTileset4 = scene.map.addTilesetImage("Background");
    const kitchenTileset5 = scene.map.addTilesetImage("mp_cs_tilemap_all");
    const kitchenTileset1 = scene.map.addTilesetImage("Play Room");
    const tilesets = [
      kitchenTileset1,
      kitchenTileset2,
      kitchenTileset3,
      kitchenTileset4,
      kitchenTileset5,
    ];
    scene.map.createLayer("Tile Layer 1", tilesets);

    scene.map.createLayer("Tile Layer 4", tilesets);
    scene.map.createLayer("Tile Layer 5", tilesets);
    scene.map.createLayer("Tile Layer 6", tilesets);
    scene.map.createLayer("Tile Layer 7", tilesets);
    scene.map.createLayer("Tile Layer 8", tilesets);
    scene.map.createLayer("Tile Layer 9", tilesets);
    scene.map.createLayer("Tile Layer 2", tilesets);
    scene.map.createLayer("Tile Layer 3", tilesets);
  }
}
