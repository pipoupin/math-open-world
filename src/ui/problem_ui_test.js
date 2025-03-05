import { Game } from "../core/game.js";
import { Ui } from "./ui.js";

export class Problem extends Ui{

    /**
     * 
     * @param {Game} game
     * @param {Number} width
     * @param {Number} height
     * @param {String} awnser 
     * @param {Array<Widget>} widgets
     */
    constructor(game, width, height, awnser, widgets){
        super(game, width, height, widgets)
        this.awnser= awnser
    }

    /**
     * 
     * @param {Game} game 
     * @param {String} src
     * @param {Number} width
     * @param {Number} height
     * @param {String} awnser 
     * @param {Array<Widget>} widgets
     */
    static async create(game, src, width, height, awnser, widgets){
        const problem = new Problem(game, width, height, awnser, widgets)
        try {
			await problem.load(src)
		} catch (error) {
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
		}
		return problem
    }
}