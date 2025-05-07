import { constants } from "../../constants.js";
import { Game } from "../../core/game.js";
import { Map } from "../../world/map.js";
import { Entity } from "../entity.js";
import { Hitbox } from "../hitbox.js";

export class Spider extends Entity{
    /**
     * 
     * @param {Game} game 
     * @param {Map} map 
     * @param {Number} worldX 
     * @param {Number} worldY 
     */
    constructor(game, map, worldX, worldY){
        super(game, map, game.tilesets["spider_tileset"],
			new Hitbox(game, map, 0, 0, constants.TILE_SIZE * 2, constants.TILE_SIZE * 2.5, true, false, null, (e, h, t) => {}),
			new Hitbox(game, map, 0, 0, constants.TILE_SIZE * 2, constants.TILE_SIZE * 2.5, false, false, null, (e, h, t) => {}),
            worldX, worldY, 150, 10,
			{combat: {x: 0, y: -0.15625 * constants.TILE_SIZE}, collision: {x: 0, y: -0.15625 * constants.TILE_SIZE}}
        )
        this.collision_hitbox.set_owner(this)
        this.combat_hitbox.set_owner(this)
        this.framesPerState = [null, 4]
    }
}