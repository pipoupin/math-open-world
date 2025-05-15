import { Entity } from "./entity.js"

export class Draggable extends Entity {
	constructor(game, map, tileset, collision_hitbox, worldX, worldY, animation_duration=null, life=null) {
		super(game, map, tileset, collision_hitbox, worldX, worldY, animation_duration, life)
		this.draggable = true
	}
}
