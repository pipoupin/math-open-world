import { Hitbox } from './hitbox.js'
import { Entity } from './entity.js'
import { Tileset } from '../world/tileset.js'
import { Game } from '../core/game.js'


// the attack class shall only have an update function
// because the melee attacks will manifest as player movements
// and the rest will be managed by dedicated classes/functions
export class Attack {
  /**
   * 
   * @param {Game} game 
   * @param {Map} map 
   * @param {Number} duration 
   * @param {Number} damage 
   * @param {Number} time_origin 
   */
  constructor(game, map, duration, damage, time_origin) {
    this.game = game
    this.map = map

    this.damage = damage
    this.duration = duration

    this.hitboxes = []

    this.time_origin = time_origin

    game.attacks.push(this)
  }

  // specific to the attack
  updateCombatHitboxes() {
  }

  update() {
    this.updateCombatHitboxes()
  }

  destroy() {
    this.game.attacks.slice(this.game.attacks.indexOf(this, 1))
  }
}

export class ProjectileAttack extends Attack {
  /**
   * 
   * @param {Game} game 
   * @param {Map} map 
   * @param {Number} duration 
   * @param {Number} damage 
   * @param {Number} time_origin 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} width 
   * @param {Number} height 
   * @param {Number} dx 
   * @param {Number} dy 
   */
  constructor(game, map, duration, damage, time_origin, x, y, width, height, dx, dy) {
    super(game, map, duration, damage, time_origin)
    this.width = width
    this.height = height
    this.dx = dx
    this.dy = dy
    /** @type {Array<Entity>} */
    this.touched = []
    this.hitbox.push(
      new Hitbox(game, map, x, y, width, height, false, false, this, (entity, hitbox, time) => {
        if (entity.life > 0 || entity in hitbox.owner.touched)
          return

        entity.life -= hitbox.owner.damage
        hitbox.owner.touched.push(entity)
      })
    )
  }

  updateCombatHitboxes() {
    this.hitbox[0].move_by(this.dx, this.dy)
  }

  destroy() {
  }
}

export class MeleeAttack extends Attack {
  constructor(game, map, duration, damage, time_origin, x, y, width, height) {
    super(game, map, duration, damage, time_origin)
    this.width = width
    this.height = height

    this.hitboxes.push(
      new Hitbox(game, map, x, y, width, height, false, false, this, (entity, hitbox, time) => {
        if (entity.life > 0) {
          entity.life -= hitbox.owner.damage
        }
      })
    )
  }
}
