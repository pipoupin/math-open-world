import { Game } from "../core/game.js"
import { Hitbox } from "./hitbox.js"
import { Map } from "../world/map.js"
import { Tileset } from "../world/tileset.js"

export class Entity {

  /**
   * @param {Game} game
   * @param {Map} map 
   * @param {Tileset} tileset
   * @param {Hitbox} collision_hitbox
   * @param {Hitbox} combat_hitbox
   * @param {Number} worldX
   * @param {Number} worldY
   * @param {Number} animation_duration    
   */
  constructor(game, map, tileset, collision_hitbox, combat_hitbox, worldX, worldY, animation_duration, life=-1) {
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
  }

  /**
   * 
   * @param {Number} current_time 
   * @returns 
   */
  update(current_time) {
    if(this.game.get_current_map() != this.map)
			return

    // Split movement into X and Y components to handle collisions separately
    this.updatePositionX()
		this.updateCollisionHitbox()
    if (this.colliding()) {
      this.backPositionX()
			this.dx = 0
    }
    
    this.updatePositionY()
		this.updateCollisionHitbox()
    if (this.colliding()) {
      this.backPositionY()
			this.dy = 0
    }

    this.collision_hitbox.get_colliding_hitboxes(true, false).forEach(hitbox => {
			hitbox.command(this, hitbox)
		})

		this.combat_hitbox.get_colliding_hitboxes(false, true).forEach(hitbox => {
			hitbox.command(this, hitbox)
		})

		this.combat_hitbox.get_colliding_hitboxes(false, false).forEach(hitbox => {
			hitbox.command(this, hitbox)
		})

    this.handleAnimation(current_time)
  }

  updatePositionX() {
    const halfHitboxWidth = this.combat_hitbox.width / 2
    this.worldX = Entity.clamp(
      this.worldX + this.dx,
      halfHitboxWidth,
      this.game.map.world.width - halfHitboxWidth
    )
  }

  updatePositionY() {
    const halfHitboxHeight = this.combat_hitbox.height / 2
    this.worldY = Entity.clamp(
      this.worldY + this.dy,
      halfHitboxHeight,
      this.game.map.world.height - halfHitboxHeight
    )
  }

	updateCollisionHitbox() {
		this.collision_hitbox.set(this.worldX - this.collision_hitbox.width / 2, this.worldY)
	}

  /**
   * 
   * @param {Number} value 
   * @param {Number} min 
   * @param {Number} max 
   * @returns Number
   */
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  colliding() {
    for (let collision_hitbox of this.game.collision_hitboxes) {
      if (collision_hitbox === this.collision_hitbox) {
        continue
      }
      if (this.collision_hitbox.is_colliding(collision_hitbox)) {
        return true
      }
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
    if (current_time - this.last_time < this.animation_duration) return

    this.updateDirection()
    this.animation_step = (this.dx || this.dy) ? (this.animation_step + 1) % 4 : 0

    this.last_time = current_time
  }

  updateDirection() {
    if (this.dy > 0) this.direction = 0
    else if (this.dy < 0) this.direction = 1
    else if (this.dx > 0) this.direction = 2
    else if (this.dx < 0) this.direction = 3
  }

  render() {
    if(this.game.get_current_map() != this.map)
			return

		if (this.isWithinCameraView()) {
			this.tileset.drawTile(
				4 * this.direction + (this.animation_step !== -1 ? this.animation_step : 0) + 1,
				this.worldX - this.game.camera.x - this.game.TILE_SIZE / 2,
				this.worldY - this.game.camera.y - this.game.TILE_SIZE / 2
			)
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
}
