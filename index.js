const canvas = document.getElementById("game")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false

const TILE_SIZE = 128

var collision_hitboxes = []
var not_player_hitboxes = []
var hitboxes = []

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

class Hitbox{
	constructor(x1, y1, x2, y2, collision=false, register=true){
		this.x1 = x1
		this.x2 = x2
		this.y1 = y1
		this.y2 = y2
		this.width = Math.abs(x1 - x2)
		this.height = Math.abs(y1 - y2)
		hitboxes.push(this)
		if(collision){collision_hitboxes.push(this)}
		if(register){not_player_hitboxes.push(this)}
	}

	get_corner(i){
		if (i == 1){
			return {
				x: Math.min(this.x1, this.x2),
				y: Math.min(this.y1, this.y2)
			}
		}
		if (i == 2){
			return {
				x: Math.max(this.x1, this.x2),
				y: Math.min(this.y1, this.y2)
			}
		}
		if (i == 3){
			return {
				x: Math.min(this.x1, this.x2),
				y: Math.max(this.y1, this.y2)
			}
		}
		if (i == 4){
			return {
				x: Math.max(this.x1, this.x2),
				y: Math.max(this.y1, this.y2)
			}
		}
	}

	render(){
		ctx.strokeRect(this.get_corner(4).x - this.width / 2 - camera.x,
						this.get_corner(4).y - this.height / 2 - camera.y,
						this.width,
						this.height)
	}

	is_touching(hitbox){
		if(this.get_corner(1).x > hitbox.get_corner(2).x || this.get_corner(2).x < hitbox.get_corner(1).x){
			console.log("test 1")
			return false
		}
		if(this.get_corner(1).y > hitbox.get_corner(3).y || this.get_corner(3).y < hitbox.get_corner(1).y){
			console.log("test 2")
			return false
		}
		return true
	}

	get_touching_hitboxes(){
		let touching_hitboxes = []
		not_player_hitboxes.forEach(hitbox => {
			if (this.is_touching(hitbox)){
				touching_hitboxes.push(hitbox)
			}
		});
		return touching_hitboxes
	}
}

class PlayerHitbox extends Hitbox{
	constructor(width, height){
		super(0, 0, width, height, false)
	}

	recenter(x, y){
		this.x1 = x
		this.y1 = y
		this.x2 = this.x1 + this.width
		this.y2 = this.y1 + this.height
	}
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
  hitbox: new PlayerHitbox(64, 64),
  combat_hitbox: new PlayerHitbox(64, 120),
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

		collision_hitboxes.forEach(hitbox => {
			if(player.hitbox.is_touching(hitbox)){
				// g essayé ca ca marche pas
        //
        // player.worldX -= player.dx
        //player.dx = 0
			}
		});
  } else {
    player.dx = 0
  }

  if (newWorldY >= 0 && newWorldY <= WORLD_HEIGHT - player.hitbox.height) {
    player.worldY = newWorldY

		collision_hitboxes.forEach(hitbox => {
			if(player.hitbox.is_touching(hitbox)){
				// chais pas faites un truc aled j'arrive pas a faire des collisions
			}
		});
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
  player.hitbox.recenter(player.worldX, player.worldY + 25)
  player.combat_hitbox.recenter(player.worldX, player.worldY - 60)
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
	
	if (player.animation_step > -1) {
		playerset.drawTile(4 * player.direction + player.animation_step + 2,
			player.worldX - camera.x,
			player.worldY - camera.y,
		)
	}
	else {
		playerset.drawTile(4 * player.direction + 1,
			player.worldX - camera.x,
			player.worldY - camera.y,
		)
	}

  //draw hitboxes (debugging purpose)
  hitboxes.forEach(hitbox =>{
    hitbox.render()
  })

}

function gameLoop() {
  update()
  render()
  requestAnimationFrame(gameLoop)
}

gameLoop()
