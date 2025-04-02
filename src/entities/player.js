import { constants } from '../constants.js'
import { Game } from '../core/game.js'
import { Entity } from './entity.js'
import { Hitbox } from './hitbox.js'
import { Map } from '../world/map.js'
import { clamp, Resizeable } from '../utils.js'

export class Player extends Entity {
	/**
	 * @param {Game} game - The current game
	 * @param {TileSet} player_tileset - the tileset used for animating the player
	 */
	constructor(game, player_tileset) {
		super(
			game, game.get_current_map(), player_tileset,
			new Hitbox(game, game.get_current_map(), 400, 400 + constants.TILE_SIZE / 2, 2 * constants.TILE_SIZE / 3, constants.TILE_SIZE / 2, true, true, null, (e, h, t) => {}),
			new Hitbox(game, game.get_current_map(), 400, 400, 2 * constants.TILE_SIZE / 3, constants.TILE_SIZE, false, true, null, (e, h, t) => {}),
			600, 600, 175, {combat: {x: 0, y: 0}, collision: {x: 0, y: constants.TILE_SIZE / 4}}, -1
		)

		this.collision_hitbox.owner = this
		this.combat_hitbox.owner = this

		this.player = true

		this.inputHandler = game.inputHandler

		this.fullSpeed = new Resizeable(game, 0.078125 * constants.TILE_SIZE)
		this.acceleration = new Resizeable(game, 0.03125 * constants.TILE_SIZE)
		this.last_dash = -constants.PLAYER_DASH_COOLDOWN // used both for during the dash and for waiting state
		this.dash_reset = false
		this.dashing = false

		this.raycast_hitbox = new Hitbox(game, game.get_current_map(), 400, 400, 0, 100, false, true, this, (e, h, t) => {})
	}

	reset_dash_cooldown() {
		if (this.dashing)
			this.dash_reset = true;
		else
			this.last_dash = -constants.PLAYER_DASH_COOLDOWN
	}

	/**
	 * 
	 * @param {Number} current_time 
	 */
	update(current_time) {
		// Handle player movement
		
		if (!this.dashing && this.inputHandler.isKeyDown(constants.DASH_KEY) && current_time - this.last_dash >= constants.PLAYER_DASH_COOLDOWN) {
			this.dashing = true
			this.acceleration.set_value(10)
			this.fullSpeed.set_value(30)
			this.last_dash = current_time
		}

		if (this.dashing && current_time - this.last_dash >= constants.PLAYER_DASH_DURATION) {
			this.last_dash = this.dash_reset ? 0 : current_time
			this.dash_reset = false
			this.dashing = false
			this.fullSpeed.set_value(10)
			this.acceleration.set_value(4)
		}
	
		if (this.inputHandler.isKeyDown(constants.UP_KEY)) this.dy.set_value(this.dy.get() - this.acceleration.get())
		if (this.inputHandler.isKeyDown(constants.DOWN_KEY)) this.dy.set_value(this.dy.get() + this.acceleration.get())
		if (this.inputHandler.isKeyDown(constants.LEFT_KEY)) this.dx.set_value(this.dx.get() - this.acceleration.get())
		if (this.inputHandler.isKeyDown(constants.RIGHT_KEY)) this.dx.set_value(this.dx.get() + this.acceleration.get())

		// Handle deceleration
		if (!this.inputHandler.isKeyDown(constants.UP_KEY) && !this.inputHandler.isKeyDown(constants.DOWN_KEY))
			this.dy.set_value(Math.sign(this.dy.get()) * Math.max(Math.abs(this.dy.get()) - this.acceleration.get(), 0))
		if (!this.inputHandler.isKeyDown(constants.LEFT_KEY) && !this.inputHandler.isKeyDown(constants.RIGHT_KEY))
			this.dx.set_value(Math.sign(this.dx.get()) * Math.max(Math.abs(this.dx.get()) - this.acceleration.get(), 0))

		// Apply diagonal speed limitation
		if (this.dx.get() && this.dy.get()) {
			this.dy.set_value(Math.sign(this.dy.get()) * Math.min(this.fullSpeed.get() / Math.SQRT2, Math.abs(this.dy.get())))
			this.dx.set_value(Math.sign(this.dx.get()) * Math.min(this.fullSpeed.get() / Math.SQRT2, Math.abs(this.dx.get())))
		} else {
			this.dy.set_value(Math.sign(this.dy.get()) * Math.min(this.fullSpeed.get(), Math.abs(this.dy.get())))
			this.dx.set_value(Math.sign(this.dx.get()) * Math.min(this.fullSpeed.get(), Math.abs(this.dx.get())))
		}

		super.update(current_time)

		super.updateHitboxes()

		if(this.direction == 0){
			this.raycast_hitbox.set(this.worldX.get(), this.worldY.get(), 0, constants.TILE_SIZE)
		}
		if(this.direction == 1){
			this.raycast_hitbox.set(this.worldX.get(), this.worldY.get(), 0, - constants.TILE_SIZE)
		}
		if(this.direction == 2){
			this.raycast_hitbox.set(this.worldX.get(), this.worldY.get(), constants.TILE_SIZE, 0)
		}
		if(this.direction == 3){
			this.raycast_hitbox.set(this.worldX.get(), this.worldY.get(), - constants.TILE_SIZE, 0)
		}
	}

	/**
	 * 
	 * @param {Map} new_map 
	 */
	set_map(new_map){
		super.set_map(new_map)
		this.worldX.set_value(new_map.player_pos.x.get())
		this.worldY.set_value(new_map.player_pos.y.get())
	}

	/**
	 * 
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	set_pos(x, y) {
		this.worldX.set_value(clamp(x, constants.PLAYER_COMBAT_BOX_WIDTH/ 2, this.map.world.width.get() - constants.PLAYER_COMBAT_BOX_WIDTH/2))
		this.worldY.set_value(clamp(y, constants.PLAYER_COMBAT_BOX_HEIGHT/2, this.map.world.height.get() - constants.PLAYER_COMBAT_BOX_HEIGHT/2))
	}
}
