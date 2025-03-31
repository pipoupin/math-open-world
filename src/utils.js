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
	//soon
}