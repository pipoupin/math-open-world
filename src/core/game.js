import { Map } from '../world/map.js'
import { Tileset } from '../world/tileset.js'
import { Player } from '../entities/player.js'
import { InputHandler } from './inputHandler.js'
import { Entity } from '../entities/entity.js'
import { Hitbox } from '../entities/hitbox.js'
import { Problem } from '../ui/problem_ui_test.js'
import { Attack } from '../entities/attack.js'
import { Ui } from '../ui/ui.js'
import { Button, Label, TextArea } from '../ui/widgets.js'

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

		/** @type {Ui} */
		this.current_ui = null

		this.camera = { x: 100, y: 105.3 }
		this.TILE_SIZE = 128
	}

	async run() {
		// create class objects
		this.inputHandler = new InputHandler(this)
		const default_tileset = await Tileset.create(this, "images/map.png", 16, this.TILE_SIZE)
		const alternative_tileset = await Tileset.create(this, "images/floor.png", 16, this.TILE_SIZE)
		this.maps = [
			await Map.create(this, 'map.json', default_tileset),
			await Map.create(this, 'map copy.json', alternative_tileset)
		]
		this.current_map = 0 // "scene"
		this.map = this.maps[this.current_map]


		const player_tileset = await Tileset.create(this, 'images/spritesheet.png', 16, this.TILE_SIZE)
		this.player = new Player(this, player_tileset)
		this.entities.push(new Entity(this, this.get_current_map(), player_tileset,
			new Hitbox(this, this.get_current_map(), 0, this.TILE_SIZE / 2, this.TILE_SIZE, this.TILE_SIZE /2, true, false ),
			new Hitbox(this, this.get_current_map(), 0, 0, this.TILE_SIZE, this.TILE_SIZE, false, false),
			this.TILE_SIZE /2, this.TILE_SIZE / 2, 200
		  )
		)
		
		// test hitboxes for "command" parameter and for map switch
		new Hitbox(this, this.get_current_map(), 1000, 1000 + this.TILE_SIZE / 2, this.TILE_SIZE, this.TILE_SIZE / 2, false, false, (e, h) => {this.set_map(1)})
		new Hitbox(this, this.maps[1], 500, 500 + this.TILE_SIZE / 2, this.TILE_SIZE, this.TILE_SIZE / 2, false, false, (e, h) => {this.set_map(0)})

		// test problem
		this.update()
		var test_problem = await Problem.create(this, "images/parchment1.png", 300, 300, "oui",
					[
						new Label(this, 625, 150, "coucou"),
						new Label(this, 600, 175, "entre 'oui' dans la zone en bas:"),
						new Button(this, 625, 300, 50, 50, (button) => {
							button.ui.widgets.forEach((widget) => {
								if(widget.type == "textarea"){
									widget.submit()
								}
							})
						}),
						new TextArea(this, 625, 200, 100, 50, 10, (awnser, textarea) => {
							console.log(awnser)
							if(textarea.ui.awnser === awnser){
								textarea.ui.is_finished = true
							}
						}, 10)
					]
				)
		new Hitbox(this, this.maps[0], 200, 200, this.TILE_SIZE, this.TILE_SIZE, false, false, (entity, hitbox) => {
			this.current_ui = test_problem
			hitbox.destructor()
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
				this.current_ui = null
			} else{
				return
			}
		}

		this.player.update(current_time)
		this.camera.x = this.player.worldX - this.canvas.width / 2
		this.camera.y = this.player.worldY - this.canvas.height / 2
		this.attacks.forEach(attack => {
			if (current_time - attack.time_origin > attack.duration) {
				attack.destroy()
				this.attacks.pop(attack)
			}
		})
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.map.render()
		this.entities[0].render()
		this.player.render()

		this.hitboxes.forEach(hitbox => {hitbox.render()})

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
