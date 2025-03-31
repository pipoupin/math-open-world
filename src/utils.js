import { Game } from "./core/game"

/**
 * @param {Number} value 
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
*/
export const clamp = (x, min, max) => {
	if (x < min) return min
	if (x > max) return max
	return x
}

/**
 * 
 * @param {String} str 
 * @param {Number} lenght 
 * @returns {Array<String>}
 */
export const slice = (str, lenght) => {
	var array = []
	var sentence = ""
	str.split(" ").forEach(word => {
		if(sentence.length + word.length + 1 <= lenght){
			sentence += " "+word
		} else {
			array.push(sentence)
			sentence = word
		}
	})
	array.push(sentence)
	array[0] = array[0].slice(1)
	return array
}

export class Resizeable{
	/**
	 * Let it be for now, I will make it into the code later
	 * (this forces me to rewrite a hella LOT of code so i'm too lazy for now)
	 * @param {Game} game 
	 * @param {Number} value 
	 * @param {Boolean} [should_resize=false]
	 * @param {String} [dimension="x"]
	 */
	constructor(game, value, should_resize=false, dimension="x"){
		this.game = game
		this.should_resize = should_resize
		this.dimension = dimension
		if(this.should_resize)
			this.value = value / this.dimension=="x"? this.game.canvas.width: this.game.canvas.height
		else
			this.value = value
	}

	get(){
		if(this.should_resize)
			return this.value * (this.dimension=="x"? this.game.canvas.width: this.game.canvas.height)
		else
			return this.value
	}
}