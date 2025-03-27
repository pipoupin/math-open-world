export const config = {
	MAP_DIR: "./assets/maps/",
	IMG_DIR: "./assets/images/",
}

export const constants = {
    DEBUG: true,

    TILE_SIZE: 128,

    PLAYER_COLLISION_BOX_WIDTH: 2 * 128 / 3,
    PLAYER_COLLISION_BOX_HEIGHT: 128 / 2,
    PLAYER_COMBAT_BOX_WIDTH: 2 * 128 / 3,
    PLAYER_COMBAT_BOX_HEIGHT: 128,

    PLAYER_DASH_DURATION: 100,
    PLAYER_DASH_COOLDOWN: 3000,
    PLAYER_DASH_SPEED: 5,
    PLAYER_DASH_MAX_SPEED: 30,

    LABEL_TYPE: "label",
    BUTTON_TYPE: "button",
    TEXTAREA_TYPE: "textarea",
    NUMBERAREA_TYPE: "numberarea",
    ICON_TYPE: "icon",
    TEXTURE_TYPE: "texture",

    UP_KEY: "z",
    DOWN_KEY: "s",
    LEFT_KEY: "q",
    RIGHT_KEY: "d",
    INTERACTION_KEY: "e",
    DASH_KEY: " ",

    ACTIVE_TILES: [169]
}

// TODO: The future has arrived
// still need a bit cleaner way to do it tho
// the format is
// map_name: tile_number: {x: new_x, y: new_y, width: new_width, height: new_height}
//
// with:
// map_name the path to the map file, String
// tile_number the number of the tile that needs to be changed in the maps' tileset, Number
//
// new_x, new_y the new ccordinates of the top-left corner of the hitbox, 0 by default, Numbers
// new_width, new_height the new width and height of the hitbox, constants.TILE_SIZE by default, Numbers
//
// x, y, width and height takes their default values when not specified
export const collisions = {
    "map.json": {
        76: { width: 96, height: 112},
        113: {x: 16, y: 24, width: 96, height: 88},
        114: {x: 32, width: 64, height: 112},
        127: {x: 56, width: 72},
        131: {width: 72},
        167: {x: 56, width: 72, height: 110},
        168: {height: 110},
        170: {height: 110},
        171: {width: 72, height: 110}
    },
    "house.json": {
    }
}
