import { constants } from '../constants.js'
import { Game } from '../core/game.js'
import { Entity } from './entity.js'
import { Hitbox } from './hitbox.js'
import { clamp } from '../utils.js'

export class Player extends Entity {
	/**
	 * @param {Game} game - The current game
	 * @param {TileSet} player_tileset - the tileset used for animating the player
	 */
	constructor(game, player_tileset) {
		super(
			game, game.get_current_map(), player_tileset,
			new Hitbox(game, game.get_current_map(), 400, 400 + game.TILE_SIZE / 2, 2 * game.TILE_SIZE / 3, game.TILE_SIZE / 2, true, true, null, (e, h, t) => {}),
			new Hitbox(game, game.get_current_map(), 400, 400, 2 * game.TILE_SIZE / 3, game.TILE_SIZE, false, true, null, (e, h, t) => {}),
			600, 600, 175
		)

		this.collision_hitbox.owner = this
		this.combat_hitbox.owner = this

		this.player = true

		this.inputHandler = game.inputHandler

		this.fullSpeed = 10
		this.acceleration = 4
		this.dash_cooldown = 3000
		this.last_dash = -this.dash_cooldown
		this.dash_duration = 150

		this.raycast_hitbox = new Hitbox(game, game.get_current_map(), 400, 400, 0, 100, false, true, this, (e, h, t) => {})
	}

	/**
	 * 
	 * @param {Number} current_time 
	 */
	update(current_time) {
		// Handle player movement
		if (this.inputHandler.isKeyDown(constants.DASH_KEY) && current_time - this.last_dash >= this.dash_cooldown) {
			this.acceleration = 10
			this.fullSpeed = 30
			this.last_dash = current_time
			setTimeout(() => {
				this.fullSpeed = 10
				this.acceleration = 4
			}, this.dash_duration)
		}
		if (this.inputHandler.isKeyDown(constants.UP_KEY)) this.dy -= this.acceleration
		if (this.inputHandler.isKeyDown(constants.DOWN_KEY)) this.dy += this.acceleration
		if (this.inputHandler.isKeyDown(constants.LEFT_KEY)) this.dx -= this.acceleration
		if (this.inputHandler.isKeyDown(constants.RIGHT_KEY)) this.dx += this.acceleration

		// Handle deceleration
		if (!this.inputHandler.isKeyDown(constants.UP_KEY) && !this.inputHandler.isKeyDown(constants.DOWN_KEY))
			this.dy = Math.sign(this.dy) * Math.max(Math.abs(this.dy) - this.acceleration, 0)
		if (!this.inputHandler.isKeyDown(constants.LEFT_KEY) && !this.inputHandler.isKeyDown(constants.RIGHT_KEY))
			this.dx = Math.sign(this.dx) * Math.max(Math.abs(this.dx) - this.acceleration, 0)

		// Apply diagonal speed limitation
		if (this.dx && this.dy) {
			this.dy = Math.sign(this.dy) * Math.min(this.fullSpeed / Math.SQRT2, Math.abs(this.dy))
			this.dx = Math.sign(this.dx) * Math.min(this.fullSpeed / Math.SQRT2, Math.abs(this.dx))
		} else {
			this.dy = Math.sign(this.dy) * Math.min(this.fullSpeed, Math.abs(this.dy))
			this.dx = Math.sign(this.dx) * Math.min(this.fullSpeed, Math.abs(this.dx))
		}

		super.update(current_time)

		this.collision_hitbox.set(this.worldX - this.collision_hitbox.width / 2, this.worldY)
		this.combat_hitbox.center_around(this.worldX, this.worldY)
		if(this.direction == 0)
			this.raycast_hitbox.set(this.worldX, this.worldY, 0, 100)
		if(this.direction == 1)
			this.raycast_hitbox.set(this.worldX, this.worldY, 0, -100)
		if(this.direction == 2)
			this.raycast_hitbox.set(this.worldX, this.worldY, 100, 0)
		if(this.direction == 3)
			this.raycast_hitbox.set(this.worldX, this.worldY, -100, 0)
	}

	/**
	 * 
	 * @param {Map} new_map 
	 */
	set_map(new_map){
		super.set_map(new_map)
		this.worldX = new_map.player_pos.x
		this.worldY = new_map.player_pos.y
	}

	set_pos(x, y) {
		this.worldX = clamp(x, constants.PLAYER_COMBAT_BOX_WIDTH/ 2, this.map.world.width - constants.PLAYER_COMBAT_BOX_WIDTH/2)
		this.worldY = clamp(y, constants.PLAYER_COMBAT_BOX_HEIGHT/2, this.map.world.height - constants.PLAYER_COMBAT_BOX_HEIGHT/2)
	}
}
