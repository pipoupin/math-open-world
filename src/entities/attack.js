import { Hitbox } from './hitbox.js'
import { Entity } from './entity.js'
import { Tileset } from '../world/tileset.js'


// the attack class shall only have an update function
// because the melee attacks will manifest as player movements
// and the rest will be managed by dedicated classes/functions
export class Attack {
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
  udpateCombatHitboxes() {
  }

  update() {
    this.updateCombatHitboxes()
  }

  destroy() {
    super.destroy()
  }
}

export class ProjectileAttack extends Attack {
  constructor(game, map, duration, damage, time_origin, x, y, width, height, dx, dy) {
    super(game, map, duration, damage, time_origin)
    this.width = width
    this.height = height
    this.dx = dx
    this.dy = dy
    this.touched = []
    this.hitbox.push(
      new Hitbox(game, map, x, y, width, height, false, false, (entity) => {
        if (entity.life > 0 || entity in this.touched)
          return

        entity.life -= this.damage
        this.touched.push(entity)
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
      new Hitbox(game, map, x, y, width, height, false, false, (entity) => {
        if (entity.life > 0) {
          entity.life -= this.damage
        }
      })
    )
  }
}
