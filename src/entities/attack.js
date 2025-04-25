import { Hitbox } from './hitbox.js'
import { Entity } from './entity.js'
//import { Tileset } from '../world/tileset.js'
import { Game } from '../core/game.js'
import { Map } from '../world/map.js'
import { Resizeable } from '../utils.js'
import { constants } from '../constants.js'


export class Attack {
	/**
	 * @param {Game} game
	 * @param {Entity} attacker 
	 * @param {Map} map
	 * @param {Number} timeOrigin
	 * @param {Number} duration
	 * @param {Array<Hitbox>} hitboxes
	 * @param {(e: Entity) => void} attack
	 * @param {Boolean} [still=true] - wether the attack is still
	 * @param {Boolean} [persistent=false]
	 * @param {Number} [cooldown=null] - time between each apply in ms
	 */
	constructor(game, attacker, map, timeOrigin, duration, hitboxes, attack, still=true, persistent=false, cooldown=null) {
		/** @type {Game} */
		this.game = game
		/** @type {Map} */
		this.map = map
		/** @type {Number} */
		this.timeOrigin = timeOrigin
		/** @type {Number} */
		this.duration = duration

		for (const hitbox of hitboxes)
			hitbox.owner = this
		/** @type {Array<Hitbox>} */
		this.hitboxes = hitboxes

		/** @type {Entity} */
		this.attacker = attacker

		/** @type {(e: Entity) => void} */
		this.attack = attack
		/** @type {Array<Entity>} */
		this.entities = []

		/** @type {Boolean} */
		this.still = still

		/** @type {Boolean} */
        this.persistent = persistent
        /** @type {Number|null} */
        this.cooldown = cooldown
        /** @type {Array<Number>} */
        this.last_applies = [] // Always initialize, even for non-persistent attacks

		this.game.attacks.push(this)
	}

	update(current) {
		if (current - this.timeOrigin >= this.duration) {
			this.destroy()
		}

		if (!this.still) {
			this.updateHitboxes(current)
		}
	}

	render() {
	}

	updateHitboxes(current) {
	}

	/**
	 * @param {Entity} entity 
	 * @param {Number} current
	 * @returns {void}
	 */
	apply(entity, current) {
		const i = this.entities.indexOf(entity)
		if (i !== -1) {
			if (!this.persistent)
				return
			if (current - this.last_applies[i] >= this.cooldown) {
				this.attack(entity)
				this.last_applies[i] = current
			}
		} else {
			this.attack(entity)
			this.entities.push(entity)
			if (this.still)
				this.last_applies.push(current)
		}
	}

	destroy() {
		for (const hitbox of this.hitboxes) {
			hitbox.destroy()
		}

		const index = this.game.attacks.indexOf(this)
		if (index === -1) {
			throw new Error("Attack not found in game.attacks")
		}
		this.game.attacks.splice(index, 1)
	}
}


/**
 * Clockwise attack
 * As it's impossible to have a rotated rectangle hitbox,
 * We mimic this behaviour by having a rectangle sliding fastly
 * 			         range
 * 				 <----------->
 *             ^ +-----------+ ^
 *             | |           | | rec_width
 *             | +-----------+ v
 * slide_width |
 *             |       |
 *             |       v
 *             v
 */
export class SwingingAttack extends Attack {
    /**
     * @param {Game} game
     * @param {Entity} attacker
     * @param {Map} map
     * @param {Number} timeOrigin
     * @param {Number} duration
     * @param {{x:number, y:number}} startPoint
     * @param {Number} direction 
     * @param {Number} weapon_width 
     * @param {Number} attack_width 
     * @param {Number} range
     * @param {(e: Entity) => void} attack
     * @param {Boolean} [persistent=false]
     * @param {Number} [cooldown=null] - time between each apply in ms
     */
    constructor(game, attacker, map, timeOrigin, duration, startPoint, direction, weapon_width, attack_width, range, attack, persistent=false, cooldown=null) {
        let hitbox
        const halfWeapon = weapon_width / 2
        
        switch(direction) {
            case constants.UP_DIRECTION:
                hitbox = new Hitbox(game, map, startPoint.x - halfWeapon, startPoint.y - range, weapon_width, range)
                break
            case constants.DOWN_DIRECTION:
                hitbox = new Hitbox(game, map, startPoint.x - halfWeapon, startPoint.y, weapon_width, range)
                break
            case constants.LEFT_DIRECTION:
                hitbox = new Hitbox(game, map, startPoint.x - range, startPoint.y - halfWeapon, range, weapon_width)
                break
            case constants.RIGHT_DIRECTION:
                hitbox = new Hitbox(game, map, startPoint.x, startPoint.y - halfWeapon, range, weapon_width)
                break
        }
        
        super(game, attacker, map, timeOrigin, duration, [hitbox], attack, persistent, cooldown)
        this.direction = direction
        this.attack_width = new Resizeable(game, attack_width)
        this.weapon_width = new Resizeable(game, weapon_width)
        this.range = new Resizeable(game, range)
        this.startPoint = {
            x: new Resizeable(game, startPoint.x),
            y: new Resizeable(game, startPoint.y)
        }
    }

    updateHitboxes(current) {
        const progression = (current - this.timeOrigin) / this.duration
        const maxOffset = this.attack_width.get() - this.weapon_width.get()
        const offset = maxOffset * progression
        
        const x = this.startPoint.x.get()
        const y = this.startPoint.y.get()

        const weaponWidth = this.weapon_width.get()
		const halfAttack = this.attack_width.get()/2
		const range = this.range.get()
        
        switch(this.direction) {
            case constants.UP_DIRECTION:
                this.hitboxes[0].set(x - halfAttack + offset, y - range, weaponWidth, range)
                break
            case constants.DOWN_DIRECTION:
                this.hitboxes[0].set(x + halfAttack - offset - weaponWidth, y, weaponWidth, range)
                break
            case constants.LEFT_DIRECTION:
                this.hitboxes[0].set(x - range, y + halfAttack - offset - weaponWidth, range, weaponWidth)
                break
            case constants.RIGHT_DIRECTION:
                this.hitboxes[0].set(x, y - halfAttack + offset, range, weaponWidth)
                break
        }
    }
}


/**
 * just a still attack
 */
export class MeleeAttack extends Attack {
}

export class ProjectileAttack extends Attack {
	/**
	 * @param {Game} game
	 * @param {Entity} attacker 
	 * @param {Map} map
	 * @param {Number} timeOrigin
	 * @param {Number} duration
	 * @param {Array<Hitbox>} hitboxes
	 * @param {Number} dx
	 * @param {Number} dy
	 * @param {(e: Entity) => void} attack
	 * @param {Boolean} [persistent=false]
	 * @param {Number} [cooldown=null] - time between each apply in ms
	 */
	constructor(game, attacker, map, timeOrigin, duration, hitboxes, dx, dy, attack = (((e) => {})), persistent=false, cooldown=null) {
		super(game, attacker, map, timeOrigin, duration, hitboxes, attack, false, persistent, cooldown)
		this.dx = new Resizeable(game, dx)
		this.dy = new Resizeable(game, dy)
	}

	updateHitboxes(current) {
		for (const hb of this.hitboxes) {
			hb.move_by(this.dx.get(), this.dy.get())
		}
	}
}
