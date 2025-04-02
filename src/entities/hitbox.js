import { Game } from "../core/game.js"
import { Map } from "../world/map.js"
import { Attack } from "./attack.js"
import { Entity } from "./entity.js"
import { Resizeable } from "../utils.js"

export class Hitbox {
	/**
	 * @param {Game} game - game object reference
	 * @param {Map} map - the hitbox's map
	 * @param {Number} x - left x
	 * @param {Number} y - top y
	 * @param {Number} width - hitbox width
	 * @param {Number} height - hitbox height
	 * @param {boolean} collision - is the hitbox a collision hitbox
	 * @param {boolean} [player=false] - is the hitbox a player's hitbox
	 * @param {Attack | Entity} [owner=null] - the hitbox's owner, let null to make it unmovable
	 * @param {(entity: Entity, hitbox: Hitbox, time: Number) => void} [command=((e, h, t) => {})] - function executed when colliding with the an entity, the 'hitbox' argument refers to the actual hitbox object
	 */
	constructor(game, map, x, y, width, height, collision=false, player=false, owner = null,command=((e, h, t) => {})){
		this.game = game
		this.map = map

		this.x1 = new Resizeable(game, x)
		this.x2 = new Resizeable(game, x + width)
		this.y1 = new Resizeable(game, y)
		this.y2 = new Resizeable(game, y + height)

		this.width = new Resizeable(game, width)
		this.height = new Resizeable(game, height)

		if (collision) game.collision_hitboxes.push(this)
		else game.combat_hitboxes.push(this)
		this.game.hitboxes.push(this)
		
		this.player = player
		this.owner = owner

		this.command = command
	}

	/**
	 * @param {Number} i - index (0, 1, 2 or 3)
	 */
	get_corner(i) {
		switch(i) {
			case 0: return {x: this.x1.get(), y: this.y1.get()}
			case 1: return {x: this.x2.get(), y: this.y1.get()}
			case 2: return {x: this.x1.get(), y: this.y2.get()}
			case 3: return {x: this.x2.get(), y: this.y2.get()}
		}
	}

	/**
	 * 
	 * @param {Attack | Entity} owner 
	 */
	set_owner(owner){
		this.owner = owner
	}

	render() {
		if(this.game.get_current_map() == this.map){
			this.game.ctx.strokeStyle = this.player ? "blue" : "red"
			this.game.ctx.strokeRect(
				this.x1.get() - this.game.camera.x.get(),
				this.y1.get() - this.game.camera.y.get(),
				this.width.get(),
				this.height.get()
			)
		}
	}


	/**
	 * @param {Hitbox} hitbox
	 * @return {Boolean}
	 */
	is_colliding(hitbox) {
		if (this == hitbox) return false
		if (this.map != hitbox.map) return false
		return !(this.x1.get() > hitbox.x2.get() || hitbox.x1.get() > this.x2.get() || this.y1.get() > hitbox.y2.get() || hitbox.y1.get() > this.y2.get())
	}

	/**
	 * @param {boolean} [collision=true]
	 * @param {boolean} [combat=true]
	 * @returns {Array<Hitbox>}
	 */
	get_colliding_hitboxes(collision=true, combat=true) {
		const colliding_hitboxes = []
		if (collision) {
			for (let i = 0; i < this.game.combat_hitboxes.length; i++) {
				if (this.is_colliding(this.game.combat_hitboxes[i]))
					colliding_hitboxes.push(this.game.combat_hitboxes[i])
			}
		}

		if (combat) {
			for (let i = 0; i < this.game.collision_hitboxes.length; i++) {
				if (this.is_colliding(this.game.collision_hitboxes[i]))
					colliding_hitboxes.push(this.game.collision_hitboxes[i])
			}
		}

		if(!(combat || collision)){
			for (let i = 0; i < this.game.hitboxes.length; i++) {
				if( (! this.game.hitboxes[i] in colliding_hitboxes) && (!this.game.hitboxes[i] in this.game.collision_hitboxes) && (! this.game.hitboxes[i] in this.game.combat_hitboxes)){
					if (this.is_colliding(this.game.hitboxes[i]))
						colliding_hitboxes.push(this.game.collision_hitboxes[i])
				}
			}
		}
		return colliding_hitboxes
	}

	/**
	 * 
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	center_around(x, y) {
		this.x1.set_value(x - this.width.get() / 2)
		this.x2.set_value(x + this.width.get() / 2)
		this.y1.set_value(y - this.height.get() / 2)
		this.y2.set_value(y + this.height.get() / 2)
	}

	/**
	 * 
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {Number} [width=null] 
	 * @param {Number} [height=null] 
	 */
	set(x, y, width=null, height=null) {
		this.x1.set_value(x)
		this.y1.set_value(y)
		if(width != null) this.width.set_value(width)
		if(height != null) this.height.set_value(height)
		this.x2.set_value(x + this.width.get())
		this.y2.set_value(y + this.height.get())
		if(this.x2.get() < this.x1.get()){
			this.x1.set_value(this.x2.get())
			this.x2.set_value(x)
			this.width.set_value(this.width.get() * -1)
		}
		if(this.y2.get() < this.y1.get()){
			this.y1.set_value(this.y2.get())
			this.y2.set_value(y)
			this.height.set_value(this.height.get() * -1)
		}
	}

	/**
	 * 
	 * @param {Number} dx 
	 * @param {Number} dy 
	 */
	move_by(dx, dy) {
		this.x1.set_value(this.x1.get() + dx.get())
		this.x2.set_value(this.x2.get() + dx.get())
		this.y1.set_value(this.y1.get() + dy.get())
		this.y2.set_value(this.y2.get() + dy.get())
	}

	/**
	 * 
	 * @param {Map} new_map 
	 */
	set_map(new_map){
		this.map = new_map
	}

	destructor() {
		this.game.collision_hitboxes.splice(this.game.collision_hitboxes.indexOf(this), 1)
		this.game.hitboxes.splice(this.game.hitboxes.indexOf(this), 1)
		this.game.combat_hitboxes.splice(this.game.combat_hitboxes.indexOf(this), 1)
	}
}
