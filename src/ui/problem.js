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
     * @param {(problem: Problem) => void} widgets_state_handler 
     */
    constructor(game, width, height, awnser, widgets, widgets_state_handler){
        super(game, width, height, widgets, widgets_state_handler)
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
     * @param {(problem: Problem) => void} widgets_state_handler 
     */
    static async create(game, src, width, height, awnser, widgets, widgets_state_handler){
        const problem = new Problem(game, width, height, awnser, widgets, widgets_state_handler)
        try {
			await problem.load(src)
		} catch (error) {
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
		}
		return problem
    }
}