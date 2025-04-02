import { Game } from "../core/game.js";
import { config } from "../constants.js";
import { Resizeable } from "../utils.js";

export class Tileset {
    /**
     * !!! One shouldn't use the constructor to make a tileset, use the static create method instead
     * @param {Game} game - The current game
     * @param {Number} img_tile_size - The size of one tile in the source image (in pixels)
     * @param {Number} screen_tile_size - The size of one tile on the canvas
     * @param {Number} tileset_spacing - The spacing between tiles in the source image (in pixels)
     */
    constructor(game, img_tile_size, screen_tile_size, tileset_spacing) {
        this.img_tile_size = img_tile_size;
        this.screen_tile_size = new Resizeable(game, screen_tile_size);
        this.game = game;
        this.tileset_spacing = tileset_spacing;
        this.img = null; // Initialize the image to null
    }

    /**
     * Creates a Tileset asynchronously.
     * @param {Game} game - The current game
     * @param {String} src - The path to the source image of the tileset
     * @param {Number} img_tile_size - The size of one tile in the source image (in pixels)
     * @param {Number} screen_tile_size - The size of one tile on the canvas
     * @param {Number} tileset_spacing - The spacing between tiles in the source image (in pixels)
     * @returns {Promise<Tileset>} - The created Tileset
     * @throws {Error} - If the image fails to load
     */
    static async create(game, src, img_tile_size, screen_tile_size, tileset_spacing) {
        const tileset = new Tileset(game, img_tile_size, screen_tile_size, tileset_spacing);
        try {
            await tileset.load(config.IMG_DIR + src);
        } catch (error) {
            console.error(`Couldn't load file "${src}": ${error.message}`);
            throw new Error(`Failed to load tileset image: ${error.message}`);
        }
        return tileset;
    }

    /**
     * Loads the tileset image.
     * @param {String} src - The path to the source image
     * @returns {Promise<void>}
     * @throws {Error} - If the image fails to load
     */
    async load(src) {
        const img = new Image();
        img.src = src;
        this.img = img;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });
    }

    /**
     * Draws a tile from the tileset onto the canvas.
     * @param {Number} tile_num - The tile number to draw (1-based index)
     * @param {Number} screenX - The x-coordinate on the canvas to draw the tile
     * @param {Number} screenY - The y-coordinate on the canvas to draw the tile
     * @throws {Error} - If the tile number is out of bounds or the image is not loaded
     */
	drawTile(tile_num, screenX, screenY) {
		if (!this.img) {
			throw new Error("Tileset image not loaded.")
		}
		tile_num--;

		const tilesPerRow = Math.floor((this.img.width + this.tileset_spacing)/ (this.img_tile_size + this.tileset_spacing))

		const tile_num_x = tile_num % tilesPerRow
		const tile_num_y = Math.floor(tile_num / tilesPerRow)

		const tileX = tile_num_x * (this.img_tile_size + this.tileset_spacing)
		const tileY = tile_num_y * (this.img_tile_size + this.tileset_spacing)

		this.game.ctx.drawImage(
			this.img,
			tileX, tileY, this.img_tile_size, this.img_tile_size,
			screenX, screenY,
			this.screen_tile_size.get(), this.screen_tile_size.get()
		);
	}
}

