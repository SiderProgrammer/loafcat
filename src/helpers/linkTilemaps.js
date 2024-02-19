export function linkTilemaps(tilemap, map, nextFloor = false) {
  const y = nextFloor ? -150 : 0;
  if (map === "streetMap") {
    const streetTileset = tilemap.addTilesetImage("mp_cs_tilemap_all");
    tilemap.createLayer("Background", streetTileset);
    tilemap.createLayer("Tile Layer 5", streetTileset);
    tilemap.createLayer("Tile Layer 2", streetTileset);

    tilemap.createLayer("Tile Layer 3", streetTileset);
    tilemap.createLayer("Tile Layer 4", streetTileset);
  } else if (map === "kitchenMap") {
    const kitchenTileset = tilemap.addTilesetImage("Kitchen Room");
    const kitchenTileset2 = tilemap.addTilesetImage("Bathroom");
    const kitchenTileset3 = tilemap.addTilesetImage("Chill Room");
    const kitchenTileset4 = tilemap.addTilesetImage("Background");
    const kitchenTileset5 = tilemap.addTilesetImage("mp_cs_tilemap_all");
    const tilesets = [
      kitchenTileset,
      kitchenTileset2,
      kitchenTileset3,
      kitchenTileset4,
      kitchenTileset5,
    ];

    !nextFloor && tilemap.createLayer("Ground", tilesets, 0, y);

    tilemap.createLayer("Tile Layer 1", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 2", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 3", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 4", tilesets, 0, y);
  } else if (map === "chillRoomMap") {
    const kitchenTileset2 = tilemap.addTilesetImage("Bathroom");
    const kitchenTileset3 = tilemap.addTilesetImage("Chill Room");
    const kitchenTileset4 = tilemap.addTilesetImage("Background");
    const kitchenTileset5 = tilemap.addTilesetImage("mp_cs_tilemap_all");
    const kitchenTileset1 = tilemap.addTilesetImage("Play Room");
    const tilesets = [
      kitchenTileset1,
      kitchenTileset2,
      kitchenTileset3,
      kitchenTileset4,
      kitchenTileset5,
    ];

    !nextFloor && tilemap.createLayer("Ground", tilesets, 0, y);

    tilemap.createLayer("Tile Layer 1", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 4", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 5", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 6", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 7", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 8", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 9", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 2", tilesets, 0, y);
    tilemap.createLayer("Tile Layer 3", tilesets, 0, y);
  }
}
