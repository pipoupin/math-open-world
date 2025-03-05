import { Game } from "../core/game.js"
import { Ui } from "./ui.js"

export class Widget{
    /**
     * 
     * @param {Game} game
     * @param {Number} x - the x coordinates of the top-left corner of the widget
     * @param {Number} y - the y coordinates of the top-left corner of the widget
     * @param {String} type
     */
    constructor(game, x, y, type){
        this.game = game
        this.x = x
        this.y = y
        this.type = type
        this.has_focus = false
        /** @type {Ui} */
        this.ui = null
    }
    render(){}
}

export class Label extends Widget{
    /**
     * 
     * @param {Game} game 
     * @param {Number} x
     * @param {Number} y
     * @param {String} text
     * @param {Number} [fontsize=5]
     * @param {String} [textcolor="black"]
     * @param {string} [font="serif"]
     */
    constructor(game, x, y, text, fontsize=15, textcolor="black", font="arial"){
        super(game, x, y, "label")
        this.text = text
        this.fontsize = fontsize
        this.textcolor = textcolor
        this.font = font
    }

    render(){
        this.game.ctx.font = `${this.fontsize}px ${this.font}`
        this.game.ctx.fillStyle = this.textcolor
        this.game.ctx.fillText(this.text, this.x, this.y)
    }
}

export class Button extends Widget{
    /**
     * 
     * @param {Game} game 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @param {(button: Button) => void} command - the 'button' parameter refers to the actual object, which is being clicked
     */
    constructor(game, x, y, width, height, command){
        super(game, x, y, "button")
        this.width = width
        this.height = height
        this.command = command
    }

    render(){
        this.game.ctx.strokeStyle = "blue"
        this.game.ctx.strokeRect(
            this.x, this.y,
            this.width, this.height
        )
    }
}

export class TextArea extends Widget{
    
    /**
     * 
     * @param {Game} game 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height
     * @param {Number} max_char_number 
     * @param {(awnser: String, textarea: TextArea) => void} command 
     * @param {Number} [fontsize=5] 
     * @param {String} [textcolor="black"]
     * @param {String} [font="serif"]
     */
    constructor(game, x, y, width, height, max_char_number, command, fontsize=15, textcolor="black", font="arial"){
        super(game, x, y, "textarea")
        this.width = width
        this.height = height
        this.content = ""
        this.max_char_number = max_char_number
        this.selected = false
        this.command = command
        this.fontsize = fontsize
        this.textcolor = textcolor
        this.font = font
    }

    submit(){
        this.command(this.content, this)
    }

    render(){
        this.game.ctx.strokeStyle = "blue"
        this.game.ctx.strokeRect(
            this.x, this.y,
            this.width, this.height
        )
        this.game.ctx.fillStyle = this.textcolor
        this.game.ctx.font = `${this.fontsize}px ${this.font}`
        this.game.ctx.fillText(this.content, this.x, this.y + this.height / 2)
    }
}