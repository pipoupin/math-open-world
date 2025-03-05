import { Game } from "../core/game.js";
import { TextArea, Widget } from "./widgets.js";

export class Ui {
    /**
     * 
     * @param {Game} game
     * @param {Number} width
     * @param {Number} height
     * @param {Array<Widget>} widgets
     */
    constructor(game, width, height, widgets){
        this.game = game
        this.width = width
        this.height = height
        this.widgets = widgets
        this.widgets.forEach((widget) => {
            widget.ui = this
            console.log(`registering ui for widget of type ${widget.type}:`)
            console.log(widget)
        })
        this.focused_widget = null
        this.is_finished = false
        /** @type {TextArea} */
        this.selected_textarea = null
    }

    /**
     * 
     * @param {Game} game 
     * @param {String} src
     * @param {Number} width
     * @param {Number} height 
     * @param {Array<Widget>} widgets
     */
    static async create(game, src, width, height, widgets){
        const ui = new Ui(game, width, height, widgets)
        try {
			await ui.load(src)
		} catch (error) {
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
		}
		return ui
    }

    /**
     * @param {String} src
     */
    async load(src){
        const img = new Image()
		img.src = src
		this.img = img
		await new Promise((resolve, reject) => { 
			img.onload = resolve
			img.onerror = reject
		})
    }

    render(){
        this.game.ctx.drawImage(
            this.img,
            0, 0, this.width, this.height,
            (this.game.canvas.width - this.width) / 2,
            (this.game.canvas.height - this.height) / 2,
            this.width, this.height
        )
        for(let i = 0; i < this.widgets.length; i++){
            this.widgets[i].render()
        }
    }
}