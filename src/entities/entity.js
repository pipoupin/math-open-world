import { Game } from "../core/game.js"
import { Hitbox } from "./hitbox.js"
import { Map } from "../world/map.js"
import { Tileset } from "../world/tileset.js"
import { constants } from "../constants.js"
import { clamp, Resizeable } from "../utils.js"

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
    * @param {{ combat: { x: Number; y: Number; }; collision: { x: Number; y: Number; }; }} [hitboxes_offset={combat:{x:0,y:0},collision:{x:0,y:0}}] - The entity's hitboxes' offset in case you need them to be a little bit offcentered
    * @param {number} [life=-1] - The entity's life
    */
    constructor(game, map, tileset, collision_hitbox, combat_hitbox, worldX, worldY, animation_duration, hitboxes_offset={combat:{x:0,y:0},collision:{x:0,y:0}}, life=-1) {
        this.game = game
        this.map = map

        // World position at the center
        this.worldX = new Resizeable(game, worldX)
        this.worldY = new Resizeable(game, worldY)

        this.dx = new Resizeable(game, 1)
        this.dy = new Resizeable(game, 1)

        this.tileset = tileset
        this.collision_hitbox = collision_hitbox
        this.combat_hitbox = combat_hitbox

        this.animation_step = 0
        this.animation_duration = animation_duration
        this.direction = 0
        this.last_time = 0

        this.life = life

        this.hitboxes_offset = {
            combat: {
                x: new Resizeable(game, hitboxes_offset.combat.x),
                y: new Resizeable(game, hitboxes_offset.combat.y)
            },
            collision: {
                x: new Resizeable(game, hitboxes_offset.collision.x),
                y: new Resizeable(game, hitboxes_offset.collision.y)
            }
        }

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
            this.dx.set_value(0)
        }
        
        this.updatePositionY()
            this.updateHitboxes()
        if (this.colliding()) {
            this.backPositionY()
            this.dy.set_value(0)
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
        const halfHitboxWidth = this.combat_hitbox.width.get() / 2 + this.hitboxes_offset.combat.x.get()
        this.worldX.set_value(clamp(
            this.worldX.get() + this.dx.get(),
            halfHitboxWidth,
            this.game.map.world.width.get() - halfHitboxWidth
        ))
        if(this.worldX.get() === this.game.map.world.width.get() - halfHitboxWidth || this.worldX.get() === halfHitboxWidth)
            this.dx.set_value(0)
    }

    updatePositionY() {
        const halfHitboxHeight = this.combat_hitbox.height.get() / 2 + this.hitboxes_offset.combat.y.get()
        this.worldY.set_value(clamp(
            this.worldY.get() + this.dy.get(),
            halfHitboxHeight,
            this.game.map.world.height.get() - halfHitboxHeight
        ))
        if(this.worldY.get() === this.game.map.world.height.get() - halfHitboxHeight || this.worldY.get() === halfHitboxHeight)
            this.dy.set_value(0)
    }

    updateHitboxes() {
        this.collision_hitbox.center_around(this.worldX.get() + this.hitboxes_offset.collision.x.get(), this.worldY.get() + this.hitboxes_offset.collision.y.get())
        this.combat_hitbox.center_around(this.worldX.get() + this.hitboxes_offset.combat.x.get(), this.worldY.get() + this.hitboxes_offset.combat.y.get())
    }

    colliding() {
        for (let collision_hitbox of this.game.collision_hitboxes) {
            if (collision_hitbox === this.collision_hitbox) continue
            if (this.collision_hitbox.is_colliding(collision_hitbox)) return true
        }
        return false
    }

    backPositionX() {
        this.worldX.set_value(this.worldX.get() - this.dx.get())
        this.dx.set_value(0)
    }

    backPositionY() {
        this.worldY.set_value(this.worldY.get() - this.dy.get())
        this.dy.set_value(0)
    }

    /**
     * 
     * @param {Number} current_time 
     * @returns 
     */
    handleAnimation(current_time) {
        this.updateDirection()
        
        if (current_time - this.last_time < this.animation_duration) return

        this.animation_step = (this.dx.get() || this.dy.get()) ? (this.animation_step + 1) % 4 : 0

        this.last_time = current_time
    }

    updateDirection() {
        if (this.dy.get() === 0 && this.dx.get() === 0) return

        if (Math.abs(this.dy.get()) > Math.abs(this.dx.get())) {
            this.direction = this.dy.get() > 0 ? 0 : 1
        } else {
            this.direction = this.dx.get() > 0 ? 2 : 3
        }

    }

    render() {
        if (this.game.get_current_map() !== this.map) return;

        if (this.isWithinCameraView()) {
            const tileNum = 4 * this.direction + (this.animation_step !== -1 ? this.animation_step : 0) + 1;
            const screenX = this.worldX.get() - this.game.camera.x.get() - this.tileset.screen_tile_size.get() / 2;
            const screenY = this.worldY.get() - this.game.camera.y.get() - this.tileset.screen_tile_size.get() / 2;

            this.tileset.drawTile(tileNum, screenX, screenY);
        }

        if(constants.DEBUG){
            this.game.ctx.beginPath()
            this.game.ctx.arc(this.worldX.get() - this.game.camera.x.get(), this.worldY.get() - this.game.camera.y.get(), 3, 0, Math.PI * 2)
            this.game.ctx.fillStyle = this.player ? "blue": "red"
            this.game.ctx.fill()
        }
    }

    isWithinCameraView() {
        return (
            this.worldX.get() + this.combat_hitbox.width.get() / 2 >= this.game.camera.x.get() &&
            this.worldX.get() - this.combat_hitbox.width.get() / 2 <= this.game.camera.x.get() + this.game.canvas.width &&
            this.worldY.get() + this.combat_hitbox.height.get() / 2 >= this.game.camera.y.get() &&
            this.worldY.get() - this.combat_hitbox.height.get() / 2 <= this.game.camera.y.get() + this.game.canvas.height
        )
    }

    /**
     * 
     * @param {Map} new_map 
     */
    set_map(new_map) {
        this.map = new_map
        this.collision_hitbox.set_map(new_map)
        this.combat_hitbox.set_map(new_map)
        if (this.raycast_hitbox)
            this.raycast_hitbox.set_map(new_map)
    }
}
