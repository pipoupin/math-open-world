import { Game } from './src/core/game.js'

(async () => {
	const game = new Game()
	await game.run()
})()
