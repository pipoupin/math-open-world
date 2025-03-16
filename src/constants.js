export const config = {
	MAP_DIR: "./assets/maps/",
	IMG_DIR: "./assets/images/",
}

export const constants = {
    DEBUG: false,

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

// TODO: hopefully in a near-by future, ...
export const collisions = {
    "map.json": {
    },
    "house.json": {
    }
}
