import { constants } from "../../constants.js";
import { Game } from "../../core/game.js";
import { Map } from "../../world/map.js";
import { Entity } from "../entity.js";
import { Hitbox } from "../hitbox.js";

export class Frog extends Entity{
    /**
     * 
     * @param {Game} game 
     * @param {Map} map 
     * @param {Number} worldX 
     * @param {Number} worldY 
     */
    constructor(game, map, worldX, worldY){
        super(game, map, game.tilesets["frog"],
            new Hitbox(game, map, 0, 0, constants.TILE_SIZE * 0.8125, constants.TILE_SIZE * 0.5, true, false),
            new Hitbox(game, map, 0, 0, constants.TILE_SIZE * 0.8125, constants.TILE_SIZE * 0.5, false, false),
            worldX, worldY, 200, 5,
            {combat: {x: constants.TILE_SIZE * 0.03125, y: constants.TILE_SIZE * 0.125},
            collision: {x: constants.TILE_SIZE * 0.03125, y: constants.TILE_SIZE * 0.125}}
        )
        this.framesPerState = [5, 3]
    }
}