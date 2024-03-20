export function linkTilemaps(
    tilemap,
    map,
    nextFloor = false,
    previousFloor = false
) {
    let y = 0;
    if (nextFloor) {
        y = -110;
    } else if (previousFloor) {
        y = 291;
    }
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
        tilemap.createLayer("Tile Layer 8", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 9", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 4", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 5", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 6", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 7", tilesets, 0, y);

        tilemap.createLayer("Tile Layer 2", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 3", tilesets, 0, y);
    } else if (map === "bathroomMap") {
        const kitchenTileset2 = tilemap.addTilesetImage("Bathroom");
        const kitchenTileset3 = tilemap.addTilesetImage("Background");

        const kitchenTileset5 = tilemap.addTilesetImage("mp_cs_tilemap_all");

        const tilesets = [kitchenTileset2, kitchenTileset3, kitchenTileset5];

        !nextFloor && tilemap.createLayer("Ground", tilesets, 0, y);

        tilemap.createLayer("Tile Layer 1", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 4", tilesets, 0, y);

        tilemap.createLayer("Tile Layer 2", tilesets, 0, y);
        tilemap.createLayer("Bath", tilesets, 0, y);
    } else if (map === "livingRoomMap") {
        const kitchenTileset2 = tilemap.addTilesetImage("Bathroom");
        const kitchenTileset1 = tilemap.addTilesetImage("Background");
        const kitchenTileset3 = tilemap.addTilesetImage("Chill Room");

        const kitchenTileset5 = tilemap.addTilesetImage("mp_cs_tilemap_all");
        const kitchenTileset4 = tilemap.addTilesetImage("Play Room");

        const tilesets = [
            kitchenTileset1,
            kitchenTileset2,
            kitchenTileset3,
            kitchenTileset4,
            kitchenTileset5,
        ];

        !nextFloor && tilemap.createLayer("Ground", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 2", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 1", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 4", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 3", tilesets, 0, y);
    } else if (map === "garageMap") {
        const kitchenTileset2 = tilemap.addTilesetImage("Bathroom");
        const kitchenTileset1 = tilemap.addTilesetImage("Background");
        const kitchenTileset3 = tilemap.addTilesetImage("Chill Room");

        const kitchenTileset5 = tilemap.addTilesetImage("mp_cs_tilemap_all");
        const kitchenTileset4 = tilemap.addTilesetImage("Play Room");
        const kitchenTileset6 = tilemap.addTilesetImage("Work Room");
        const kitchenTileset7 = tilemap.addTilesetImage("Garage");

        const tilesets = [
            kitchenTileset1,
            kitchenTileset2,
            kitchenTileset3,
            kitchenTileset4,
            kitchenTileset5,
            kitchenTileset6,
            kitchenTileset7,
        ];

        !nextFloor && tilemap.createLayer("Ground", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 1", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 4", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 2", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 3", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 5", tilesets, 0, y);
    } else if (map === "laundryMap") {
        const kitchenTileset2 = tilemap.addTilesetImage("Bathroom");
        const kitchenTileset1 = tilemap.addTilesetImage("Background");
        const kitchenTileset3 = tilemap.addTilesetImage("Chill Room");

        const kitchenTileset5 = tilemap.addTilesetImage("mp_cs_tilemap_all");

        const kitchenTileset7 = tilemap.addTilesetImage("Laundry");

        const tilesets = [
            kitchenTileset1,
            kitchenTileset2,
            kitchenTileset3,

            kitchenTileset5,

            kitchenTileset7,
        ];

        !nextFloor && tilemap.createLayer("Ground", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 1", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 5", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 4", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 2", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 3", tilesets, 0, y);
    } else if (map === "bedroomMap") {
        const kitchenTileset2 = tilemap.addTilesetImage("Bathroom");
        const kitchenTileset1 = tilemap.addTilesetImage("Background");
        const kitchenTileset3 = tilemap.addTilesetImage("Chill Room");
        const kitchenTileset4 = tilemap.addTilesetImage("Bedroom");
        const kitchenTileset6 = tilemap.addTilesetImage("Chill Room");
        const kitchenTileset5 = tilemap.addTilesetImage("mp_cs_tilemap_all");
        const kitchenTileset8 = tilemap.addTilesetImage("Kitchen Room");
        const kitchenTileset7 = tilemap.addTilesetImage("Laundry");
        const kitchenTileset9 = tilemap.addTilesetImage("Play Room");

        const tilesets = [
            kitchenTileset1,
            kitchenTileset2,
            kitchenTileset3,
            kitchenTileset4,
            kitchenTileset6,

            kitchenTileset5,

            kitchenTileset7,
            kitchenTileset8,
            kitchenTileset9,
        ];

        !nextFloor && tilemap.createLayer("Ground", tilesets, 0, y);

        tilemap.createLayer("Tile Layer 4", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 2", tilesets, 0, y);
        tilemap.createLayer("Tile Layer 3", tilesets, 0, y);
    }
}
