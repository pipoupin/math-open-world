import { Map } from '../world/map.js'
import { Tileset } from '../world/tileset.js'
import { Player } from '../entities/player.js'
import { InputHandler } from './inputHandler.js'
import { Entity } from '../entities/entity.js'
import { Hitbox } from '../entities/hitbox.js'
import { Problem } from '../ui/problem.js'
import { Attack } from '../entities/attack.js'
import { Ui } from '../ui/ui.js'
import { Button, Icon, Label, NumberArea, TextArea, Texture } from '../ui/widgets.js'
import { Talkable } from '../entities/talkable.js'
import { constants } from "../constants.js"
import { Transition, UnicoloreTransition } from '../ui/transition.js'

export class Game {
	constructor() {
		// setup canvas & context
		/** @type {HTMLCanvasElement} */
		this.canvas = document.getElementById('game')
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight

		/** @type {CanvasRenderingContext2D} */
		this.ctx = this.canvas.getContext('2d')
		this.ctx.imageSmoothingEnabled = false

		document.addEventListener('resize', () => {
			this.canvas.width = window.innerWidth
			this.canvas.height = window.innerHeight

			/** @type {CanvasRenderingContext2D} */
			this.ctx = this.canvas.getContext('2d')
			this.ctx.imageSmoothingEnabled = false
		})

		// prevent right-click (as it provokes bugs)
		document.addEventListener('contextmenu', (event) => {
			event.preventDefault()
		})

		// initialize attributes
		/** @type {Array<Hitbox>} */
		this.hitboxes = []
		/** @type {Array<Hitbox>} */
		this.collision_hitboxes = []
		/** @type {Array<Hitbox>} */
		this.combat_hitboxes = []

		/** @type {Array<Entity>} */
		this.entities = []
		/** @type {Array<Attack>} */
		this.attacks = []

		/** @type {Array<Talkable>} */
		this.talkables = []

		/** @type {Ui | Transition} */
		this.current_ui = null

		this.camera = { x: -1000, y: -1000 }
		this.TILE_SIZE = 128
	}

	async run() {
		// create class objects
		this.inputHandler = new InputHandler(this)
		const default_tileset = await Tileset.create(this, "images/map.png", 16, this.TILE_SIZE, 0)
		const alternative_tileset = await Tileset.create(this, "images/floor.png", 16, this.TILE_SIZE, 0)
		const pretty_face_tileset = await Tileset.create(this, "images/pretty_face_tileset.png", 16, this.TILE_SIZE, 1)
		this.maps = [
			await Map.create(this, 'house.json', pretty_face_tileset, "black", {x: 4 * constants.TILE_SIZE, y: 2.5 * constants.TILE_SIZE}),
			//await Map.create(this, 'map.json', default_tileset, "black", {x: 100, y: 100}),
			//await Map.create(this, 'map copy.json', alternative_tileset, "black"),
			await Map.create(this, 'main_map.json', default_tileset, "grey", {x: 15 * constants.TILE_SIZE, y: 16 * constants.TILE_SIZE})
		]
		this.current_map = 0 // "scene"
		this.map = this.maps[this.current_map]


		const player_tileset = await Tileset.create(this, 'images/spritesheet.png', 16, this.TILE_SIZE, 0)
		this.player = new Player(this, player_tileset)
		this.player.set_map(this.get_current_map())
		
		// test hitboxes for "command" parameter and for map switch
		//new Hitbox(this, this.get_current_map(), 1000, 1000 + this.TILE_SIZE / 2, this.TILE_SIZE, this.TILE_SIZE / 2, false, false, (e, h) => {this.set_map(1)})
		//new Hitbox(this, this.maps[1], 500, 500 + this.TILE_SIZE / 2, this.TILE_SIZE, this.TILE_SIZE / 2, false, false, (e, h) => {this.set_map(0)})

		// used to place the player correctly
		this.update()

		const black_transition = new UnicoloreTransition(this, 500, "black")

		const colors_problem = await Problem.create(
			this, "images/parchment1.png", 500, 500, "colors",
			[
				new Label(this, "label-red", -150, -150, "Rouge:", true, 30),
				new NumberArea(this, "numberarea-red", -50, -150, 100, 50, 15, true, (answer, numberarea) => {}, 20),

				new Label(this, "label-green", -150, -50, "Vert:", true, 30),
				new NumberArea(this, "numberarea-green", -50, -50, 100, 50, 15, true, (answer, numberarea) => {}, 20),

				new Label(this, "label-yellow", -150, 50, "Jaune:", true, 30),
				new NumberArea(this, "numberarea-yellow", -50, 50, 100, 50, 15, true, (answer, numberarea) => {}, 20),

				new Button(this, "button-submit", -25, 150, 100, 50, true, (button) => {
					const numberarea_red = button.ui.get_widget("numberarea-red");
					const numberarea_green = button.ui.get_widget("numberarea-green");
					const numberarea_yellow = button.ui.get_widget("numberarea-yellow");

					if (numberarea_red.content === "3" && numberarea_green.content === "2" && numberarea_yellow.content === "3") {
						button.ui.is_finished = true;
						console.log("bonnes réponses");
						//colors_problem.destroy()
					} else {
						console.log("mauvaises réponses [debug: bonnes réponses sont 3, 2, 3]");
						console.log(numberarea_red.content, numberarea_green.content , numberarea_yellow.content );
					}
				})
			],
			(problem) => {
				if (problem.get_widget("button-submit").is_clicked) {
					console.log("button cliked");
				}
			}
		)
		new Talkable(this, this.get_current_map(),
			new Hitbox(this, this.get_current_map(), 0, constants.TILE_SIZE * 2, this.TILE_SIZE, this.TILE_SIZE, true, false, null, (e, h, t) => {}),
			colors_problem, null
		)

		// house borders hitboxes
		new Hitbox(this, this.get_current_map(), 0, 5 * constants.TILE_SIZE, 3 * constants.TILE_SIZE, constants.TILE_SIZE, true, false, null, (e, h, t) => {})
		new Hitbox(this, this.get_current_map(), 5 * constants.TILE_SIZE, 5 * constants.TILE_SIZE, 3 * constants.TILE_SIZE, constants.TILE_SIZE, true, false, null, (e, h, t) => {})

		// Door hitboxes
		new Hitbox(this, this.maps[1], 15 * constants.TILE_SIZE, 13 * constants.TILE_SIZE, constants.TILE_SIZE, constants.TILE_SIZE / 2, true, false, null, (e, h, t) => {})

		// switch map hitboxes
		new Hitbox(this, this.get_current_map(), 3 * constants.TILE_SIZE, 5.5 * constants.TILE_SIZE, 2 * constants.TILE_SIZE, constants.TILE_SIZE / 2, false, false, null, (e, h, time) => {
			this.maps[1].player_pos.x = 1985
			this.maps[1].player_pos.y = 1800
			this.get_current_map().player_pos.x = this.player.worldX
			this.get_current_map().player_pos.y = this.player.worldY - constants.TILE_SIZE / 3
			console.log(this.player)
			this.set_map(1)
			black_transition.start(time)
		})

		new Hitbox(this, this.maps[1], 15 * constants.TILE_SIZE, 13.5 * constants.TILE_SIZE, constants.TILE_SIZE, constants.TILE_SIZE / 2, false, false, null, (e, h, time) => {
			this.set_map(0)
			black_transition.start(time)
		})

		requestAnimationFrame(this.loop.bind(this))
	}

	/**
	 * 
	 * @param {Number} current_time 
	 * @returns 
	 */
	update(current_time) {
		if(this.current_ui){
			if(this.current_ui.is_finished){
				this.current_ui.is_finished = false
				this.current_ui = null
			} else{
				this.current_ui.update(current_time)
				return
			}
		}

		this.player.update(current_time)
		this.camera.x = this.player.worldX - this.canvas.width / 2
		this.camera.y = this.player.worldY - this.canvas.height / 2

		if (this.get_current_map().world.width <= this.canvas.width) {
			this.camera.x = (this.get_current_map().world.width - this.canvas.width) / 2;
		} else {
			this.camera.x = Math.max(0, Math.min(this.camera.x, this.get_current_map().world.width - this.canvas.width));
		}

		if (this.get_current_map().world.height <= this.canvas.height) {
			this.camera.y = (this.get_current_map().world.height - this.canvas.height) / 2;
		} else {
			this.camera.y = Math.max(0, Math.min(this.camera.y, this.get_current_map().world.height - this.canvas.height));
		}


		this.attacks.forEach(attack => {
			if (current_time - attack.time_origin > attack.duration) {
				attack.destroy()
				this.attacks.pop(attack)
			}
		})

		this.talkables.forEach(talkable => {talkable.update()})
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.get_current_map().render_ground_blocks()

		this.entities.forEach(entity => {entity.render()})

		this.player.render()

		this.get_current_map().render_perspective()
		
		this.hitboxes.forEach(hitbox => {hitbox.render()})
		this.talkables.forEach(talkable => {talkable.render()})

		if(this.current_ui){
			this.current_ui.render()
		}
	}

	/**
	 * 
	 * @param {Number} current_time 
	 */
	loop(current_time) {
		this.update(current_time)
		this.render()
		requestAnimationFrame(this.loop.bind(this))
	}

	/**
	 * 
	 * @param {Number} new_map_nb 
	 */
	set_map(new_map_nb){
		this.current_map = new_map_nb
		this.map = this.maps[this.current_map]
		this.player.set_map(this.map)
	}

	get_current_map(){
		return this.maps[this.current_map]
	}
}
