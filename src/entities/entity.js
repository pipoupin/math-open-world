import { Game } from "../core/game.js"
import { Hitbox } from "./hitbox.js"
import { Map } from "../world/map.js"
import { Tileset } from "../world/tileset.js"
import { constants } from "../constants.js"
import { clamp } from "../utils.js"

export class Entity {

  /**
   * @param {Game} game - The current game
   * @param {Map} map - The map in which the entity should show up
   * @param {Tileset} tileset - the tileset used to animate the entity
   * @param {Hitbox} collision_hitbox - the entity's hitbox used for handling collision with the player
   * @param {Hitbox} combat_hitbox - the entity's hitbox used for handling attacks
   * @param {Number} worldX - the entity's x position in the world
   * @param {Number} worldY - the entity's y position in the world
   * @param {Number} animation_duration - the animation's frames' duration
   * @param {{ combat: { x: number; y: number; }; collision: { x: number; y: number; }; }} [hitboxes_offset={combat: {x: 0, y: 0}, collision: {x: 0, y: 0}}] 
   */
  constructor(game, map, tileset, collision_hitbox, combat_hitbox, worldX, worldY, animation_duration, life=-1, hitboxes_offset={combat: {x: 0, y: 0}, collision: {x: 0, y: 0}}) {
    this.game = game
    this.map = map

    // World position at the center
    this.worldX = worldX
    this.worldY = worldY

    this.dx = 1
    this.dy = 1

    this.tileset = tileset
    this.collision_hitbox = collision_hitbox
    this.combat_hitbox = combat_hitbox

    this.animation_step = 0
    this.animation_duration = animation_duration
    this.direction = 0
    this.last_time = 0

    this.life = life

    this.hitboxes_offset = hitboxes_offset

    this.game.entities.push(this)
  }

  /**
   * @param {Number} current_time 
   * @returns 
   */
  update(current_time) {
    if(this.game.get_current_map() != this.map)
			return

    // Split movement into X and Y components to handle collisions separately
    this.updatePositionX()
		this.updateHitboxes()
    if (this.colliding()) {
      this.backPositionX()
			this.dx = 0
    }
    
    this.updatePositionY()
		this.updateHitboxes()
    if (this.colliding()) {
      this.backPositionY()
			this.dy = 0
    }

    this.collision_hitbox.get_colliding_hitboxes(true, false).forEach(hitbox => {
			hitbox.command(this, hitbox, current_time)
		})

		this.combat_hitbox.get_colliding_hitboxes(false, true).forEach(hitbox => {
			hitbox.command(this, hitbox, current_time)
		})

		this.combat_hitbox.get_colliding_hitboxes(false, false).forEach(hitbox => {
			hitbox.command(this, hitbox, current_time)
		})

    this.handleAnimation(current_time)
  }

  updatePositionX() {
    const halfHitboxWidth = this.combat_hitbox.width / 2
    this.worldX = clamp(
      this.worldX + this.dx,
      halfHitboxWidth,
      this.game.map.world.width - halfHitboxWidth
    )
  }

  updatePositionY() {
    const halfHitboxHeight = this.combat_hitbox.height / 2
    this.worldY = clamp(
      this.worldY + this.dy,
      halfHitboxHeight,
      this.game.map.world.height - halfHitboxHeight
    )
  }

	updateHitboxes() {
		this.collision_hitbox.center_around(this.worldX + this.hitboxes_offset.collision.x, this.worldY + this.hitboxes_offset.collision.y)
    this.combat_hitbox.center_around(this.worldX + this.hitboxes_offset.combat.x, this.worldY + this.hitboxes_offset.combat.y)
  }

  colliding() {
    for (let collision_hitbox of this.game.collision_hitboxes) {
      if (collision_hitbox === this.collision_hitbox) continue
      if (this.collision_hitbox.is_colliding(collision_hitbox)) return true
    }
    return false
  }

  backPositionX() {
    this.worldX -= this.dx
    this.dx = 0
  }

  backPositionY() {
    this.worldY -= this.dy
    this.dy = 0
  }

  /**
   * 
   * @param {Number} current_time 
   * @returns 
   */
  handleAnimation(current_time) {
    this.updateDirection()
    
    if (current_time - this.last_time < this.animation_duration) return

    this.animation_step = (this.dx || this.dy) ? (this.animation_step + 1) % 4 : 0

    this.last_time = current_time
  }

  updateDirection() {
    if (this.dy === 0 && this.dx === 0) return

    if (Math.abs(this.dy) > Math.abs(this.dx)) {
      this.direction = this.dy > 0 ? 0 : 1
    } else {
      this.direction = this.dx > 0 ? 2 : 3
    }

  }

  render() {
    if (this.game.get_current_map() !== this.map) return;

    if(constants.DEBUG){
      this.game.ctx.beginPath()
      this.game.ctx.arc(this.worldX - this.game.camera.x, this.worldY - this.game.camera.y, 3, 0, Math.PI * 2)
      this.game.ctx.fillStyle = this.player ? "blue": "red"
      this.game.ctx.fill()

      this.collision_hitbox.render()
      this.combat_hitbox.render()

      if(!this.player){
        console.log(this.worldX - this.game.camera.x, this.worldY - this.game.camera.y)
        console.log(this.worldX, this.worldY)
        console.log(this.game.camera)
      }
    }

    if (this.isWithinCameraView()) {
      const tileNum = 4 * this.direction + (this.animation_step !== -1 ? this.animation_step : 0) + 1;
      const screenX = this.worldX - this.game.camera.x - this.tileset.screen_tile_size / 2;
      const screenY = this.worldY - this.game.camera.y - this.tileset.screen_tile_size / 2;

      this.tileset.drawTile(tileNum, screenX, screenY);
    }
  }

  isWithinCameraView() {
    return (
      this.worldX + this.combat_hitbox.width / 2 >= this.game.camera.x &&
      this.worldX - this.combat_hitbox.width / 2<= this.game.camera.x + this.game.canvas.width &&
      this.worldY + this.combat_hitbox.height / 2>= this.game.camera.y &&
      this.worldY - this.combat_hitbox.height / 2<= this.game.camera.y + this.game.canvas.height
    )
  }

  set_map(new_map) {
		this.map = new_map
    this.collision_hitbox.set_map(new_map)
		this.combat_hitbox.set_map(new_map)
    if (this.raycast_hitbox)
      this.raycast_hitbox.set_map(new_map)
  }
}
