export class Hitbox {
	/*
	 * @param {Game} game - game object reference
	 * @param {Number} x1 - left x
	 * @param {Number} y1 - top y
	 * @param {Number} x2 - right x
	 * @param {Number} y2 - bot y
	 * @param {Boolean} collision
	 */
	constructor(game, x, y, width, height, collision=false, player=false){
		this.game = game

		this.x1 = x
		this.x2 = x + width
		this.y1 = y
		this.y2 = y + height

		this.width = width
		this.height = height

		if (collision) game.collision_hitboxes.push(this)
		else game.combat_hitboxes.push(this)
		
		this.player = player
	}


	/*
	 * @param {Number} i - index (0, 1, 2 or 3)
	 */
	get_corner(i) {
		switch(i) {
			case 0: return {x: this.x1, y: this.y1}
			case 1: return {x: this.x2, y: this.y1}
			case 2: return {x: this.x1, y: this.y2}
			case 3: return {x: this.x2, y: this.y2}
		}
	}

	render() {
		this.game.ctx.strokeStyle = this.player ? "blue" : "red"
		this.game.ctx.strokeRect(
			this.x1 - this.game.camera.x,
			this.y1 - this.game.camera.y,
			this.width,
			this.height
		)
	}


	/*
	 * @param {Hitbox} hitbox
	 * @return {Boolean}
	 */
	is_colliding(hitbox) {
		return !(this.x1 > hitbox.x2 || hitbox.x1 > this.x2 || this.y1 > hitbox.y2 || hitbox.y1 > this.y2)
	}

	get_colliding_hitboxes(collision=true, combat=true) {
		const colliding_hitboxes = []
		if (collision) {
			for (let i = 0; i < this.game.combat_hitboxes.length; i++) {
				if (this.is_colliding(this.game.combat_hitboxes[i]) && this.game.combat_hitboxes[i].player != this.player)
					colliding_hitboxes.push(this.game.combat_hitboxes[i])
			}
		}

		if (combat) {
			for (let i = 0; i < this.game.collision_hitboxes.length; i++) {
				if (this.is_colliding(this.game.collision_hitboxes[i]) && this.game.collision_hitboxes[i].player != this.player)
					colliding_hitboxes.push(this.game.collision_hitboxes[i])
						}
		}

		return colliding_hitboxes
	}

	center_around(x, y) {
		this.x1 = x - this.width / 2
		this.x2 = x + this.width / 2
		this.y1 = y - this.height / 2
		this.y2 = y + this.height / 2
	}

	set(x, y) {
		this.x1 = x
		this.y1 = y
		this.x2 = x + this.width
		this.y2 = y + this.height
	}

	destructor() {
		this.game.collision_hitboxes.splice(collision_hitboxes.indexOf(this), 1)
	}
}
