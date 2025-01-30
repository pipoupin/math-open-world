const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const TILE_SIZE = 130


const gameMap = [
	[1, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 1, 3],
	[2, 1, 4, 5, 3, 1, 5, 2, 4, 1, 2, 5, 3, 4, 2, 1],
	[3, 4, 1, 2, 5, 4, 3, 1, 2, 4, 5, 3, 2, 1, 4, 5],
	[4, 3, 2, 1, 5, 2, 3, 4, 1, 5, 2, 4, 1, 3, 2, 1],
	[5, 2, 1, 3, 4, 1, 5, 3, 4, 2, 5, 3, 2, 4, 1, 5],
	[1, 5, 3, 4, 2, 1, 3, 5, 4, 1, 2, 5, 1, 3, 4, 2],
	[2, 4, 5, 3, 1, 2, 5, 1, 3, 2, 4, 5, 2, 1, 5, 4],
	[3, 1, 2, 5, 4, 3, 1, 4, 5, 2, 1, 3, 5, 4, 2, 3],
	[4, 5, 1, 2, 3, 5, 4, 1, 2, 3, 4, 1, 2, 5, 3, 1],
	[5, 3, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 5],
	[1, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 1, 3],
	[2, 1, 4, 5, 3, 1, 5, 2, 4, 1, 2, 5, 3, 4, 2, 1],
	[3, 4, 1, 2, 5, 4, 3, 1, 2, 4, 5, 3, 2, 1, 4, 5],
	[4, 3, 2, 1, 5, 2, 3, 4, 1, 5, 2, 4, 1, 3, 2, 1]
]

const MAP_WIDTH = gameMap[0].length
const MAP_HEIGHT = gameMap.length

const WORLD_WIDTH = MAP_WIDTH * TILE_SIZE
const WORLD_HEIGHT = MAP_HEIGHT * TILE_SIZE

const colors = {
	1: "red",
	2: "blue",
	3: "green",
	4: "purple",
	5: "orange"
}

const camera = {
	x: 0,
	y: 0
}

const player = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	dx: 0,
	dy: 0,
	hitbox: {
		width: 50,
		height: 80
	},
	worldX: 0,
	worldY: 0,
	fullSpeed: 10,
	acceleration: 4
}

const keys = {}
window.addEventListener("keydown", (e) => keys[e.key] = true)
window.addEventListener("keyup", (e) => keys[e.key] = false)

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	player.x = canvas.width / 2
	player.y = canvas.height / 2
})

function update() {
	if (keys["z"]) player.dy -= player.acceleration
	if (keys["s"]) player.dy += player.acceleration
	if (keys["q"]) player.dx -= player.acceleration
	if (keys["d"]) player.dx += player.acceleration

	if (!keys["z"] && !keys["s"])
		player.dy = Math.sign(player.dy) * Math.max(Math.abs(player.dy) - player.acceleration, 0)
	if (!keys["q"] && !keys["d"])
		player.dx = Math.sign(player.dx) * Math.max(Math.abs(player.dx) - player.acceleration, 0)

	if (player.dx && player.dy) {
		player.dy = Math.sign(player.dy) * Math.min(player.fullSpeed/1.3, Math.abs(player.dy))
		player.dx = Math.sign(player.dx) * Math.min(player.fullSpeed/1.3, Math.abs(player.dx))
	}
	else {
		player.dy = Math.sign(player.dy) * Math.min(player.fullSpeed, Math.abs(player.dy))
		player.dx = Math.sign(player.dx) * Math.min(player.fullSpeed, Math.abs(player.dx))
	}

	const newWorldX = player.worldX + player.dx
	const newWorldY = player.worldY + player.dy
    
	if (0 <= newWorldX && newWorldX <= WORLD_WIDTH - TILE_SIZE) {
		player.worldX = newWorldX
	}
	else {
		player.dx = 0
	}
    
	if (0 <= newWorldY && newWorldY <= WORLD_HEIGHT - TILE_SIZE) {
		player.worldY = newWorldY
	}
	else {
		player.dy = 0
	}

	camera.x = player.worldX - canvas.width / 2
	camera.y = player.worldY - canvas.height / 2
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const startTileX = Math.max(0, Math.floor(camera.x / TILE_SIZE))
	const startTileY = Math.max(0, Math.floor(camera.y / TILE_SIZE))
	const endTileX = Math.min(MAP_WIDTH - 1, startTileX + Math.ceil(canvas.width / TILE_SIZE) + 1)
	const endTileY = Math.min(MAP_HEIGHT - 1, startTileY + Math.ceil(canvas.height / TILE_SIZE) + 1)

	for (let y = startTileY; y < endTileY; y++) {
		for (let x = startTileX; x < endTileX; x++) {
			const screenX = x * TILE_SIZE - camera.x
			const screenY = y * TILE_SIZE - camera.y

			ctx.fillStyle = colors[gameMap[y][x]]
			ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE)
		}
	}

	ctx.fillStyle = "darkgreen"
	ctx.fillRect(
		player.x - player.hitbox.width / 2,
		player.y - player.hitbox.height / 2,
		player.hitbox.width,
		player.hitbox.height
	)
}

function gameLoop() {
	update()
	render()
	requestAnimationFrame(gameLoop)
}

gameLoop()
