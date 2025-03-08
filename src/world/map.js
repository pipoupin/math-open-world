import { Game } from "../core/game.js"
import { Tileset } from "./tileset.js"

export class Map {
	/**
	 * !!! One shouldn't use the constructor to make a map, use the static create method instead
	 * @param {Game} game - The current game
	 * @param {Tileset} tileset - The tileset used to render the map
	 */
	constructor(game, tileset) {
		this.game = game
		this.tileset = tileset
		this.layers = []
		this.world = {}
	}

	/**
	 * A scenery on which are put other objects (entities, hitboxes, ...). This method is async and static
	 * @param {Game} game - The current game
	 * @param {String} src - The path to the json file used as a reference to layout the map
	 * @param {Tileset} tileset - The tileset used to render the map
	 * @returns Map
	 */
	static async create(game, src, tileset) {
		const map = new Map(game, tileset)
		try {
			await map.load(src)
		} catch (error) {
			console.error(`Failed to load map "${src}": ${error.message}`);
		}
		return map
	}

	/**
	 * 
	 * @param {String} src 
	 */
	async load(src) {
			// extract json
			const response = await fetch(src)
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`)
			}
			const body = await response.json()
			this.width = body.width
			this.height = body.height
			this.world.width = this.width * this.game.TILE_SIZE
			this.world.height = this.height * this.game.TILE_SIZE
			for (let layer of body.layers) {
				if (layer.type === "tilelayer")
					this.layers.push(layer.data)
			}
	}

	/**
	 * 
	 * @param {Number} layer_i 
	 * @param {Number} x 
	 * @param {Number} y 
	 * @returns 
	 */
	get_cell(layer_i, x, y) {
		return this.layers[layer_i][y * this.width + x]
	}

	render() {
		const startTileX = Math.max(0, Math.floor(this.game.camera.x / this.game.TILE_SIZE))
		const startTileY = Math.max(0, Math.floor(this.game.camera.y / this.game.TILE_SIZE))
		const endTileX = Math.min(this.width, Math.ceil((this.game.camera.x + this.game.canvas.width) / this.game.TILE_SIZE))
		const endTileY = Math.min(this.height, Math.ceil((this.game.camera.y + this.game.canvas.height) / this.game.TILE_SIZE))

		for (let y = startTileY; y < endTileY; y++) {
			for (let x = startTileX; x < endTileX; x++) {
				const screenX = x * this.game.TILE_SIZE - this.game.camera.x
				const screenY = y * this.game.TILE_SIZE - this.game.camera.y

				for (let i = 0; i < this.layers.length; i++)
					this.tileset.drawTile(this.get_cell(i,x,y), screenX, screenY)
			}
		}
	}
}
