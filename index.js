const canvas = document.getElementById("game")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false

const TILE_SIZE = 128

const collision_hitboxes = [] // for "body" collision
const hitboxes = [] // for attacks

const gameMap = 
	[
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 2, 2, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 2, 2, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 2, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 8, 8, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 8, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 5, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const MAP_WIDTH = gameMap[0].length
const MAP_HEIGHT = gameMap.length

const WORLD_WIDTH = MAP_WIDTH * TILE_SIZE
const WORLD_HEIGHT = MAP_HEIGHT * TILE_SIZE

function destroy(object) {
	object.destructor()
	delete object
}

class TileSet {
  /**
   * @param {String} src - source of the image in the DOM 
   * @param {number} tile_size - tile size in the image
   */
  constructor(src, tile_size) {
    this.tile_size = tile_size;
    this.img = new Image();
    
    const imgElement = document.querySelector(`img[src="${src}"]`);
    if (imgElement) {
      this.img.src = imgElement.src;
      this.img.onload = () => {
        console.log(`Image loaded successfully: ${src}`);
      };
    } else {
      console.error(`Failed to find image in the DOM: ${src}`);
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx - canvas context to draw
   * @param {number} tileNum nth-tile
   * @param {number} x - X screen coord
   * @param {number} y - Y screen coord
   */
  drawTile(tileNum, x, y) {
    if (!this.img.complete) {
      console.warn("Image not loaded yet")
      return
    }

    const tilesPerRow = this.img.width / this.tile_size
    const tileX = (tileNum - 1) % tilesPerRow * this.tile_size
    const tileY = Math.floor((tileNum - 1) / tilesPerRow) * this.tile_size


    ctx.drawImage(
      this.img,
      tileX, tileY, this.tile_size, this.tile_size,
      Math.floor(x), Math.floor(y), TILE_SIZE, TILE_SIZE
    )
  }
}

class Hitbox {
	/*
	 * @param {Number} x1 - left x
	 * @param {Number} y1 - top y
	 * @param {Number} x2 - right x
	 * @param {Number} y2 - bot y
	 * @param {Boolean} collision
	 */
	constructor(x1, y1, x2, y2, collision=false, player=false){
		this.x1 = Math.min(x1, x2)
		this.x2 = Math.max(x1, x2)
		this.y1 = Math.min(y1, y2)
		this.y2 = Math.max(y1, y2)

		this.width = Math.abs(x1 - x2)
		this.height = Math.abs(y1 - y2)

		if(collision) collision_hitboxes.push(this)
		else hitboxes.push(this)
		
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

	/*
	 * @param {CanvasRenderingContext2D} ctx
	 */
	render(ctx){
		ctx.strokeRect(
			this.x1 - camera.x,
			this.y1 - camera.y,
			this.width,
			this.height
		)
	}


	/*
	 * @param {Hitbox} hitbox
	 * @return {Boolean}
	 */
	is_colliding(hitbox) {
		return !(this.x1 > hitbox.x2 || hitbox.x1 > this.x2 || this.y1 > hitbox.y2 || hitbox.y1 > this.y2)
	}

	get_colliding_hitboxes() {
		const colliding_hitboxes = []
		for (let i = 0; i < hitboxes.length; i++)
			if (this.is_colliding(hitboxes[i]) && hitboxes[i].player != this.player)
				colliding_hitboxes.push(hitboxes[i])
		for (let i = 0; i < hitboxes.length; i++)
			if (this.is_colliding(hitboxes[i]) && hitboxes[i].player != this.player)
				colliding_hitboxes.push(hitboxes[i])
		return colliding_hitboxes
	}

	center_around(x, y) {
		this.x1 = x - this.width / 2
		this.x2 = x + this.width / 2
		this.y1 = y - this.height / 2
		this.y2 = y + this.height / 2
	}

	destructor() {
		collision_hitboxes.splice(collision_hitboxes.indexOf(this), 1)
	}
}

class Entity {
}

class Player extends Entity {
}

const tileset = new TileSet("floor.png", 16)
const playerset = new TileSet("spritesheet.png", 16)
const camera = {
  x: 0,
  y: 0
}

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: 0,
  dy: 0,
  hitbox: new Hitbox(0, 0, 64, 64, true, true),
  combat_hitbox: new Hitbox(0,0, 64, 80, false, true),
  worldX: WORLD_WIDTH/2,
  worldY: WORLD_HEIGHT/2,
  fullSpeed: 10,
  acceleration: 4,
	direction: 0,
	animation_step: -1,
	animation_duration: 100
}

// Handle keyboard input
const keys = {}
window.addEventListener("keydown", (e) => keys[e.key] = true)
window.addEventListener("keyup", (e) => keys[e.key] = false)

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
	ctx.imageSmoothingEnabled = false
  player.x = canvas.width / 2
  player.y = canvas.height / 2
})

let last_time = Date.now()

function update() {
	let current_time = Date.now()
  // Handle player movement
  if (keys["z"]) player.dy -= player.acceleration
  if (keys["s"]) player.dy += player.acceleration
  if (keys["q"]) player.dx -= player.acceleration
  if (keys["d"]) player.dx += player.acceleration

  // Handle deceleration
  if (!keys["z"] && !keys["s"])
    player.dy = Math.sign(player.dy) * Math.max(Math.abs(player.dy) - player.acceleration, 0)
  if (!keys["q"] && !keys["d"])
    player.dx = Math.sign(player.dx) * Math.max(Math.abs(player.dx) - player.acceleration, 0)

  // Apply diagonal speed limitation
  if (player.dx && player.dy) {
    player.dy = Math.sign(player.dy) * Math.min(player.fullSpeed / Math.SQRT2, Math.abs(player.dy))
    player.dx = Math.sign(player.dx) * Math.min(player.fullSpeed / Math.SQRT2, Math.abs(player.dx))
  } else {
    player.dy = Math.sign(player.dy) * Math.min(player.fullSpeed, Math.abs(player.dy))
    player.dx = Math.sign(player.dx) * Math.min(player.fullSpeed, Math.abs(player.dx))
  }

  // Update player world position with boundary checking
  const newWorldX = player.worldX + player.dx
  const newWorldY = player.worldY + player.dy

  if (newWorldX >= 0 && newWorldX <= WORLD_WIDTH - player.hitbox.width) {
    player.worldX = newWorldX
  } else {
    player.dx = 0
  }

  if (newWorldY >= 0 && newWorldY <= WORLD_HEIGHT - player.hitbox.height) {
    player.worldY = newWorldY
  } else {
    player.dy = 0
  }


	if (current_time - last_time >= player.animation_duration) {

		if (player.dy > 0) {
			player.direction = 0
		}
		else if (player.dy < 0) {
			player.direction = 1
		}
		else if (player.dx > 0) {
			player.direction = 2
		}
		else if (player.dx < 0) {
			player.direction = 3
		}

		if (player.dx || player.dy)
			player.animation_step++
		else
			player.animation_step = -1
		player.animation_step %= 3
		last_time = current_time
	}

  // Update camera position
  camera.x = player.worldX - canvas.width / 2
  camera.y = player.worldY - canvas.height / 2

  //update player's hitbox
  player.hitbox.center_around(player.worldX, player.worldY)
  player.combat_hitbox.center_around(player.worldX, player.worldY)
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Calculate visible tile range
  const startTileX = Math.max(0, Math.floor(camera.x / TILE_SIZE))
  const startTileY = Math.max(0, Math.floor(camera.y / TILE_SIZE))
  const endTileX = Math.min(MAP_WIDTH, Math.ceil((camera.x + canvas.width) / TILE_SIZE))
  const endTileY = Math.min(MAP_HEIGHT, Math.ceil((camera.y + canvas.height) / TILE_SIZE))

  // Draw visible tiles
  for (let y = startTileY; y < endTileY; y++) {
    for (let x = startTileX; x < endTileX; x++) {
      const screenX = x * TILE_SIZE - camera.x
      const screenY = y * TILE_SIZE - camera.y
			if (gameMap[y][x] > -1)
				tileset.drawTile(gameMap[y][x], screenX, screenY)
    }
  }

  // Draw player
	playerset.drawTile(4 * player.direction + player.animation_step + 2,
		player.worldX - camera.x - TILE_SIZE / 2,
		player.worldY - camera.y - TILE_SIZE / 2
	)

  //draw hitboxes (debugging purpose)
  hitboxes.forEach(hitbox =>{
    hitbox.render(ctx)
  })

}

function gameLoop() {
  update()
  render()
  requestAnimationFrame(gameLoop)
}

gameLoop()
