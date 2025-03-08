import { Game } from "../core/game.js"

export class Tileset {
	/**
	 * !!! One shouldn't use the constructor to make a tileset, use the static create method instead
	 * @param {Game} game - The current game
	 * @param {Number} img_tile_size - The size of one tile in the source image (in pixels)
	 * @param {Number} screen_tile_size - The size of one tile on the canvas
	 */
	constructor(game, img_tile_size, screen_tile_size) {
		this.img_tile_size = img_tile_size
		this.screen_tile_size = screen_tile_size
		this.game = game
	}

	/**
	 * 
	 * @param {Game} game - The current game
	 * @param {String} src - The path to the source image of the tileset
	 * @param {Number} img_tile_size - The size of one tile in the source image (in pixels)
	 * @param {Number} screen_tile_size - The size of one tile on the canvas
	 * @returns Tileset
	 */
	static async create(game, src, img_tile_size, screen_tile_size) {
		const tileset = new Tileset(game, img_tile_size, screen_tile_size)
		try {
			await tileset.load(src)
		} catch (error) {
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
		}
		return tileset
	}

	/**
	 * 
	 * @param {String} src 
	 */
	async load(src) {
		const img = new Image()
		img.src = src
		this.img = img
		await new Promise((resolve, reject) => { 
			img.onload = resolve
			img.onerror = reject
		})
	}

	/**
	 * 
	 * @param {Number} tile_num 
	 * @param {Number} screenX 
	 * @param {Number} screenY 
	 */
	drawTile(tile_num, screenX, screenY) {
		const tilesPerRow = this.img.width / this.img_tile_size
		const tileX = (tile_num - 1) % tilesPerRow * this.img_tile_size
		const tileY = Math.floor((tile_num - 1) / tilesPerRow) * this.img_tile_size

		this.game.ctx.drawImage(
			this.img,
			tileX, tileY, this.img_tile_size, this.img_tile_size,
			Math.floor(screenX), Math.floor(screenY),
			this.screen_tile_size, this.screen_tile_size
		)
	}
}
