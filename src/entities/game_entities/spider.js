import { constants } from "../../constants.js";
import { Game } from "../../core/game.js";
import { Map } from "../../world/map.js";
import { Tileset } from "../../world/tileset.js";
import { Entity } from "../entity.js";
import { Hitbox } from "../hitbox.js";

export class Spider extends Entity{
    /**
     * 
     * @param {Game} game 
     * @param {Map} map 
     * @param {Tileset} tileset 
     * @param {Number} worldX 
     * @param {Number} worldY 
     * @param {Number} size 
     */
    constructor(game, map, tileset, worldX, worldY, size){
        super(game, map, tileset,
			new Hitbox(game, map, 0, 0, constants.TILE_SIZE * 2 * size, constants.TILE_SIZE * 2.5 * size, true, false, null, (e, h, t) => {}),
			new Hitbox(game, map, 0, 0, constants.TILE_SIZE * 2 * size, constants.TILE_SIZE * 2.5 * size, false, false, null, (e, h, t) => {}),
            worldX, worldY, 150, 10,
			{combat: {x: 0, y: -0.15625 * constants.TILE_SIZE * size}, collision: {x: 0, y: -0.15625 * constants.TILE_SIZE * size}}
        )
        this.collision_hitbox.set_owner(this)
        this.combat_hitbox.set_owner(this)
        this.framesPerState = [null, 4]
    }

    /**
     * 
     * @param {Game} game 
     * @param {Map} map 
     * @param {Number} worldX 
     * @param {Number} worldY 
     * @param {number} [size=1] 
     * @returns {Spider}
     */
    static async create(game, map, worldX, worldY, size=1){
        let tileset = await Tileset.create(game, "spider_tileset.png", 100, constants.TILE_SIZE * 4 * size, 0)
        return new Spider(game, map, tileset, worldX, worldY, size)
    }
}