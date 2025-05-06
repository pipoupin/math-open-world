import { constants } from "../../constants.js";
import { Game } from "../../core/game.js";
import { Map } from "../../world/map.js";
import { Tileset } from "../../world/tileset.js";
import { Entity } from "../entity.js";
import { Hitbox } from "../hitbox.js";

export class Frog extends Entity{
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
            new Hitbox(game, map, 0, 0, constants.TILE_SIZE * size * 0.8125, constants.TILE_SIZE * 0.5 * size, true, false, null, (e, h, t) => {}),
            new Hitbox(game, map, 0, 0, constants.TILE_SIZE * size * 0.8125, constants.TILE_SIZE * 0.5 * size, false, false, null, (e, h, t) => {}),
            worldX, worldY, 200, 5, {combat: {x: constants.TILE_SIZE * 0.03125, y: constants.TILE_SIZE * 0.125}, collision: {x: constants.TILE_SIZE * 0.03125, y: constants.TILE_SIZE * 0.125}}
        )
        this.collision_hitbox.set_owner(this)
        this.combat_hitbox.set_owner(this)
        this.framesPerState = [5, 3]
    }

    /**
     * 
     * @param {Game} game 
     * @param {Map} map 
     * @param {Number} worldX 
     * @param {Number} worldY 
     * @param {number} [size=1] 
     * @returns {Frog}
     */
    static async create(game, map, worldX, worldY, size=1){
        let tileset = await Tileset.create(game, "frog.png", 16, constants.TILE_SIZE * size, 0)
        return new Frog(game, map, tileset, worldX, worldY, size)
    }
}