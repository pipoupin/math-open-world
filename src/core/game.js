import { Map } from '../world/map.js'
import { Tileset } from '../world/tileset.js'
import { Player } from '../entities/player.js'
import { InputHandler } from './inputHandler.js'
import { Entity } from '../entities/entity.js'
import { Hitbox } from '../entities/hitbox.js'
import { Problem, TimedProblem } from '../ui/problem.js'
import { Attack } from '../entities/attack.js'
import { Ui } from '../ui/ui.js'
import { Button, NumberArea } from '../ui/widgets.js'
import { Talkable } from '../entities/talkable.js'
import { config, constants } from "../constants.js"
import { Transition, UnicoloreTransition } from '../ui/transition.js'
import { Dialogue, QuestionDialogue } from '../ui/dialogue.js'
import { Resizeable } from '../utils.js'
import { Inventory } from '../ui/inventory.js'
import { Item } from '../ui/items.js'

export class Game {
	constructor() {
		// setup canvas & context
		/** @type {HTMLCanvasElement} */
		this.canvas = document.getElementById('game')
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight

		constants.TILE_SIZE = this.canvas.width / 10

		/** @type {CanvasRenderingContext2D} */
		this.ctx = this.canvas.getContext('2d')
		this.ctx.imageSmoothingEnabled = false

		window.addEventListener('resize', () => {
			this.canvas.width = window.innerWidth
			this.canvas.height = window.innerHeight

			/** @type {CanvasRenderingContext2D} */
			this.ctx = this.canvas.getContext('2d')
			this.ctx.imageSmoothingEnabled = false

			constants.TILE_SIZE = this.canvas.width / 10
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

		/** @type {Item} */
		this.items = {}

		/** @type {Ui | Transition} */
		this.current_ui = null

		this.zero = new Resizeable(this, 0)

		this.camera = { x: new Resizeable(this, -1000), y: new Resizeable(this, -1000)}
	}

	async run() {
		// create class objects
		this.inputHandler = new InputHandler(this)
		const default_tileset = await Tileset.create(this, "map.png", 16, constants.TILE_SIZE, 0)
		const cabane_tilset = await Tileset.create(this, "cabane_tileset.png", 16, constants.TILE_SIZE, 0)
		const spider_tile_set = await Tileset.create(this, "spider_tileset.png", 100, constants.TILE_SIZE * 4, 0)
		this.maps = [
			await Map.create(this, 'house.json', cabane_tilset, "black", {x: constants.TILE_SIZE * 1.5, y: 3 * constants.TILE_SIZE}),
			await Map.create(this, 'map.json', default_tileset, "grey", {x: 15.5 * constants.TILE_SIZE, y: 14.01 * constants.TILE_SIZE})

		]
		this.current_map = 0 // "scene"
		this.map = this.maps[this.current_map]

		// test entity
		const test_spider_entity = new Entity(this, this.maps[1], spider_tile_set,
			new Hitbox(this, this.maps[1], 0, 0, constants.TILE_SIZE * 2, constants.TILE_SIZE * 2.5, true, false, null, (e, h, t) => {}),
			new Hitbox(this, this.maps[1], 0, 0, constants.TILE_SIZE * 2, constants.TILE_SIZE * 2.5, false, false, null, (e, h, t) => {}),
			constants.TILE_SIZE * 2, constants.TILE_SIZE * 2, 150, {combat: {x: 0, y: -0.15625 * constants.TILE_SIZE}, collision: {x: 0, y: -0.15625 * constants.TILE_SIZE}}, 10
		)

		const player_tileset = await Tileset.create(this, 'spritesheet.png', 16, constants.TILE_SIZE, 0)
		const inventory = await Inventory.create(this, "inventory.png")
		this.player = new Player(this, player_tileset, inventory)
		this.player.set_map(this.get_current_map())
		
		// used to place the player correctly
		this.update()

		const colors_problem_finishing_ui = await Ui.create(this, "opened_book_ui.png", 880, 580, [
			new Button(this, "button",
				- this.canvas.width / 2, - this.canvas.height / 2, this.canvas.width, this.canvas.height,
				true, (button) => {
					button.ui.is_finished = true
				})
			], (ui) => {})

		const black_transition = new UnicoloreTransition(this, 500, "black")

		const colors_problem = await Problem.create(
			this, "book_ui.png", 440, 580, "colors",
			[
				new NumberArea(this, "numberarea-pink", -100, -110, 60, 80, 1, true, (numberarea) => {}, 80, "black", "Times New Roman", ""),

				new NumberArea(this, "numberarea-blue", -20, -110, 60, 80, 1, true, (numberarea) => {}, 80, "black", "Times New Roman", ""),

				new NumberArea(this, "numberarea-red", 60, -110, 60, 80, 1, true, (numberarea) => {}, 80, "black", "Times New Roman", ""),

				// No more needed but I leave it there in case
				// new Button(this, "button-submit", -50, 155, 100, 50, true, (button) => {
					
				// }),
				new Button(this, "button-undo-1", 200, -(this.canvas.height / 2), this.canvas.width / 2 - 200, this.canvas.height, true,(button)=>{
					button.ui.is_finished=true
				}),
				new Button(this, "button-undo-2", -(this.canvas.width / 2), -(this.canvas.height / 2), this.canvas.width / 2 - 200, this.canvas.height, true, (button)=>{
					button.ui.is_finished=true
				}),
				new Button(this, "button-undo-3", -200, 230, 400, this.canvas.height / 2 - 230, true, (button)=>{
					button.ui.is_finished=true
				}),
				new Button(this, "button-undo-4", -200, -(this.canvas.height / 2), 400, this.canvas.height / 2 - 270, true, (button)=>{
					button.ui.is_finished=true
				}),

				new Button(this, "open-button", this.canvas.width / 16, this.canvas.height / 16, 100, 100, false, (button)=>{
					button.game.current_ui = colors_problem_finishing_ui
				})
			],
			(problem) => {
				const numberarea_pink = problem.get_widget("numberarea-pink");
				const numberarea_blue = problem.get_widget("numberarea-blue");
				const numberarea_red = problem.get_widget("numberarea-red");

				if(numberarea_pink.has_focus){

				} else {

				}

				if(numberarea_blue.has_focus){

				} else {

				}

				if(numberarea_red.has_focus){

				} else {

				}

				if (numberarea_pink.content === "3" && numberarea_blue.content === "4" && numberarea_red.content === "4") {
					problem.source.is_talkable = false
					problem.get_widget("open-button").rendered = true;
				}	
			}
		)
		const colors_problem_shelf = new Talkable(this, this.get_current_map(),
			new Hitbox(this, this.get_current_map(), constants.TILE_SIZE * 3, constants.TILE_SIZE * 3, constants.TILE_SIZE, constants.TILE_SIZE, false, false, null, (e, h, t) => {}),
			colors_problem, null
		)
		colors_problem.set_source(colors_problem_shelf)


		// test dialogue and its hitbox
		var threats_dialogue = await Dialogue.create(this, "dialogue_box.png",
			"Go and die !!!", (dialogue) => {}, constants.TILE_SIZE / 3
		)

		var mqc_dialogue = await QuestionDialogue.create(this, "dialogue_box.png",
			"Press 'Space' to dash, dash has a 10 seconds cooldown. You can also press 'E' when facing an object to interact with it.",
			["Ok", "No"], // anything can be added here and the box will be automatically generated
			this.canvas.width / 4, this.canvas.height / 4, this.canvas.width / 8, this.canvas.height / 16,
			"anwser_box.png", (dialogue, anwser) => {
				if(anwser == "No"){
					dialogue.game.current_ui = threats_dialogue
				}
				dialogue.source.destructor()
			}, constants.TILE_SIZE / 5, "black", "arial"
		)
		var dialogue_test = new Hitbox(this, this.get_current_map(), 0, 4 * constants.TILE_SIZE, constants.TILE_SIZE, constants.TILE_SIZE, false, false, null, (e, h, t) => {
			if(!e instanceof Player) return
			h.game.current_ui = mqc_dialogue
		})
		mqc_dialogue.set_source(dialogue_test)

		// SWITCH MAP HITBOXES
		// -- from the house (manual)
		new Hitbox(this, this.get_current_map(), 3 * constants.TILE_SIZE, 8 * constants.TILE_SIZE, constants.TILE_SIZE, constants.TILE_SIZE, false, false, null, (e, h, time) => {
			if(!e instanceof Player) return
			if (!this.inputHandler.isKeyPressed(constants.INTERACTION_KEY)) return // one must press INTERACTION_KEY to switch map
			this.maps[0].set_player_pos({x: this.player.worldX.get(), y: this.player.worldY.get() - constants.TILE_SIZE / 2})
			this.set_map(1)

			this.player.set_map(this.maps[1])
			this.player.direction = 0

			// reset dash
			if (this.player.dashing)
				this.player.dash_reset = true
			else
				this.player.last_dash = -constants.PLAYER_DASH_COOLDOWN


			black_transition.start(time)
		})
		// -- from the house (auto)
		new Hitbox(this, this.get_current_map(), 3 * constants.TILE_SIZE, 8.75 * constants.TILE_SIZE, constants.TILE_SIZE, constants.TILE_SIZE / 4, false, false, null, (e, h, time) => {
			if(!e instanceof Player) return
			this.maps[0].set_player_pos({x: this.player.worldX.get(), y: this.player.worldY.get() - constants.TILE_SIZE / 2})
			this.set_map(1)

			this.player.set_map(this.maps[1])
			this.player.direction = 0

			// reset dash
			if (this.player.dashing)
				this.player.dash_reset = true
			else
				this.player.last_dash = -constants.PLAYER_DASH_COOLDOWN

			black_transition.start(time)
		})

		// -- from the outside (manually activated)
		new Hitbox(this,
			this.maps[1],
			15 * constants.TILE_SIZE,
			13.5 * constants.TILE_SIZE,
			constants.TILE_SIZE,
			constants.TILE_SIZE / 2.859375,
			false,
			false,
			null,
			(e, h, time) => {
				if(!e instanceof Player) return
				if (!this.inputHandler.isKeyPressed(constants.INTERACTION_KEY)) return
				this.maps[1].set_player_pos({x: 15.5 * constants.TILE_SIZE, y: 14.01 * constants.TILE_SIZE})

				this.set_map(0)

				this.player.set_map(this.maps[0])
				this.player.direction = 1

				this.player.reset_dash_cooldown()

				black_transition.start(time)
			}
		)
		// -- from the outside (automatic)
		new Hitbox(this,
			this.maps[1],
			15 * constants.TILE_SIZE,
			13 * constants.TILE_SIZE,
			constants.TILE_SIZE,
			constants.TILE_SIZE / 4, 
			false, 
			false, 
			null, 
			(e, h, time) => {
				if(!e instanceof Player) return
				this.maps[1].set_player_pos({x: 15.5 * constants.TILE_SIZE, y: 14.01 * constants.TILE_SIZE})

				this.set_map(0)

				this.player.set_map(this.maps[0])
				this.player.direction = 1

				this.player.reset_dash_cooldown()

				black_transition.start(time)
			}
		)

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
				if((this.current_ui instanceof Transition
					|| this.current_ui instanceof TimedProblem)
					&& !this.current_ui.start_time)

					this.current_ui.start_time = current_time
				this.current_ui.update(current_time)
				return
			}
		}

		this.get_current_map().update(current_time)

		this.entities.forEach(entity => {entity.update(current_time)})

		this.camera.x.set_value(this.player.worldX.get() - this.canvas.width / 2)
		this.camera.y.set_value(this.player.worldY.get() - this.canvas.height / 2)

		if (this.get_current_map().world.width.get() <= this.canvas.width) {
			this.camera.x.set_value((this.get_current_map().world.width.get() - this.canvas.width) / 2);
		} else {
			this.camera.x.set_value(Math.max(0, Math.min(this.camera.x.get(), this.get_current_map().world.width.get() - this.canvas.width)));
		}

		if (this.get_current_map().world.height.get() <= this.canvas.height) {
			this.camera.y.set_value((this.get_current_map().world.height.get() - this.canvas.height) / 2);
		} else {
			this.camera.y.set_value(Math.max(0, Math.min(this.camera.y.get(), this.get_current_map().world.height.get() - this.canvas.height)));
		}


		this.attacks.forEach(attack => {
			if (current_time - attack.time_origin > attack.duration) {
				attack.destroy()
				this.attacks.pop(attack)
			}
		})

		this.talkables.forEach(talkable => {talkable.update()})

		this.player.inventory.update(current_time)
	}

	render() {

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.get_current_map().render_ground_blocks()

		this.entities.forEach(entity => {entity.render()})

		this.player.render()

		this.get_current_map().render_perspective()
		
		if(constants.DEBUG){
			this.hitboxes.forEach(hitbox => {hitbox.render()})
			this.talkables.forEach(talkable => {talkable.render()})
		}

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
	}

	/**
	 * 
	 * @returns {Map}
	 */
	get_current_map(){
		return this.maps[this.current_map]
	}
}
