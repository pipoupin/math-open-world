export class Tileset {
	constructor(game, tile_size) {
		this.tile_size = tile_size
		this.game = game
	}

	static async create(game, src, tile_size) {
		const tileset = new Tileset(game, tile_size)
		try {
			await tileset.load(src)
		} catch (error) {
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
		}
		return tileset
	}

	async load(src) {
		const img = new Image()
		img.src = src
		this.img = img
		await new Promise((resolve, reject) => { 
			img.onload = resolve
			img.onerror = reject
		})
	}

	drawTile(tile_num, screenX, screenY) {
		const tilesPerRow = this.img.width / this.tile_size
		const tileX = (tile_num - 1) % tilesPerRow * this.tile_size
		const tileY = Math.floor((tile_num - 1) / tilesPerRow) * this.tile_size

		this.game.ctx.drawImage(
			this.img,
			tileX, tileY, this.tile_size, this.tile_size,
			Math.floor(screenX), Math.floor(screenY),
			this.game.TILE_SIZE, this.game.TILE_SIZE
		)
	}
}
