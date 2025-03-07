import { constants } from "../constants.js"
import { Game } from "../core/game.js"
import { Tileset } from "../world/tileset.js"
import { Ui } from "./ui.js"

export class Widget{
    /**
     * 
     * @param {Game} game
     * @param {String} id 
     * @param {Number} x - the x coordinates of the top-left corner of the widget
     * @param {Number} y - the y coordinates of the top-left corner of the widget
     * @param {String} type
     * @param {Boolean} rendered 
     */
    constructor(game, id, x, y, type, rendered){
        this.game = game
        this.x = x
        this.y = y
        this.type = type
        this.id = id
        this.has_focus = false
        /** @type {Ui} */
        this.ui = null
        this.rendered = rendered
    }
    render(){}
    update_config(){}
}

export class Label extends Widget{
    /**
     * 
     * @param {Game} game 
     * @param {String} id 
     * @param {Number} x
     * @param {Number} y
     * @param {String} text
     * @param {Boolean} rendered 
     * @param {Number} [fontsize=5]
     * @param {String} [textcolor="black"]
     * @param {string} [font="serif"]
     */
    constructor(game, id, x, y, text, rendered, fontsize=15, textcolor="black", font="arial"){
        super(game, id, x, y, constants.LABEL_TYPE, rendered)
        this.text = text
        this.fontsize = fontsize
        this.textcolor = textcolor
        this.font = font
    }

    render(){
        if(this.rendered){
            this.game.ctx.font = `${this.fontsize}px ${this.font}`
            this.game.ctx.fillStyle = this.textcolor
            this.game.ctx.fillText(this.text, this.x, this.y)
        }
    }

    /**
     * 
     * @param {null} [x=null] 
     * @param {null} [y=null] 
     * @param {String} [text = null] 
     * @param {null} [rendered=null] 
     * @param {Number} [fontsize = null]
     * @param {String} [textcolor = null]
     * @param {String} [font = null]
     */
    update_config(x=null, y=null, text=null, rendered=null, fontsize=null, textcolor=null, font=null){
        if(x) this.x = x
        if(y) this.y = y
        if(text) this.text = text
        if(rendered != null) this.rendered = rendered
        if(fontsize) this.fontsize = fontsize
        if(textcolor) this.textcolor = textcolor
        if(font) this.font = font
    }
}

export class Button extends Widget{
    /**
     * 
     * @param {Game} game 
     * @param {String} id 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Boolean} rendered 
     * @param {(button: Button) => void} command - the 'button' parameter refers to the actual object, which is being clicked
     */
    constructor(game, id, x, y, width, height, rendered, command){
        super(game, id, x, y, constants.BUTTON_TYPE, rendered)
        this.width = width
        this.height = height
        this.command = command
        this.is_clicked = false
    }

    render(){
        if(this.rendered){
            this.game.ctx.strokeStyle = "blue"
            this.game.ctx.strokeRect(
                this.x, this.y,
                this.width, this.height
            )
        }
    }

    /**
     * 
     * @param {Number} [x = null] 
     * @param {Number} [y = null] 
     * @param {Number} [width = null] 
     * @param {Number} [height = null] 
     * @param {Boolean} [rendered = null]
     * @param {(button: Button) => void} [command = null] 
     */
    update_config(x=null, y=null, width=null, height=null, rendered=null, command=null){
        if(x) this.x = x
        if(y) this.y = y
        if(width) this.width = width
        if(height) this.height = height
        if(rendered != null) this.rendered = rendered
        if(command) this.command = command
    }
}

export class TextArea extends Widget{
    
    /**
     * 
     * @param {Game} game 
     * @param {String} id 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height
     * @param {Number} max_char_number 
     * @param {Boolean} rendered 
     * @param {(awnser: String, textarea: TextArea) => void} command 
     * @param {Number} [fontsize=5] 
     * @param {String} [textcolor="black"]
     * @param {String} [font="arial"]
     * @param {(textarea: TextArea) => void} [on_clicked=((textarea) => {})] 
     */
    constructor(game, id, x, y, width, height, max_char_number, rendered, command, fontsize=15, textcolor="black", font="arial", on_clicked=((textarea) => {})){
        super(game, id, x, y, constants.TEXTAREA_TYPE, rendered)
        this.width = width
        this.height = height
        this.content = ""
        this.max_char_number = max_char_number
        this.selected = false
        this.command = command
        this.fontsize = fontsize
        this.textcolor = textcolor
        this.font = font
        this.on_clicked = on_clicked
        this.is_clicked = false
    }

    submit(){
        this.command(this.content, this)
    }

    render(){
        if(this.rendered){
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

    /**
     * 
     * @param {Number} [x = null] 
     * @param {Number} [y = null] 
     * @param {Number} [width = null] 
     * @param {Number} [height = null] 
     * @param {String} [content = null] 
     * @param {Number} [max_char_number = null] 
     * @param {Boolean} [rendered=null] 
     * @param {(awnser: String, textarea: TextArea) => void} [command = null] 
     * @param {Number} [fontsize = null] 
     * @param {String} [textcolor = null] 
     * @param {String} [font = null] 
     * @param {(textarea: TextArea) => void} [on_clicked = null]
     */
    update_config(x=null, y=null, width=null, height=null, content=null, max_char_number=null, rendered=null, command=null, fontsize=null, textcolor=null, font=null, on_clicked=null){
        if(x) this.x = x
        if(y) this.y = y
        if(width) this.width = width
        if(height) this.height = height
        if(max_char_number) this.max_char_number = max_char_number
        if(rendered != null) this.rendered = rendered
        if(content) this.content = content.slice(0, this.max_char_number)
        if(command) this.command = command
        if(fontsize) this.fontsize = fontsize
        if(textcolor) this.textcolor = textcolor
        if(font) this.font = font
        if(on_clicked) this.on_clicked = on_clicked
    }
}

export class NumberArea extends TextArea{
    /**
     * 
     * @param {Game} game 
     * @param {String} id 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height
     * @param {Number} max_char_number 
     * @param {Boolean} rendered 
     * @param {(awnser: String, textarea: TextArea) => void} command 
     * @param {Number} [fontsize=5] 
     * @param {String} [textcolor="black"]
     * @param {String} [font="serif"]
     * @param {(textarea: TextArea) => void} [on_clicked = null]
     */
    constructor(game, id, x, y, width, height, max_char_number, rendered, command, fontsize=15, textcolor="black", font="arial", on_clicked=((textarea) => {})){
        super(game, id, x, y, width, height, max_char_number, rendered, command, fontsize, textcolor, font)
        this.type = constants.NUMBERAREA_TYPE
    }
}

export class Icon extends Widget{
    /**
     * 
     * @param {Game} game 
     * @param {String} id 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Tileset} tileset 
     * @param {Number} tile_nb 
     */
    constructor(game, id, x, y, tileset, tile_nb, rendered){
        super(game, id, x, y, constants.ICON_TYPE, rendered)
        this.tileset = tileset
        this.tile_nb = tile_nb
    }

    render(){
        if(this.rendered){
            this.tileset.drawTile(this.tile_nb, this.x, this.y)
        }
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Tileset} tileset 
     * @param {Number} tile_nb 
     * @param {Boolean} rendered 
     */
    update_config(x=null, y=null, tileset=null, tile_nb=null, rendered=null){
        if(x) this.x = x
        if(y) this.y = y
        if(tileset) this.tileset = tileset
        if(tile_nb) this.tile_nb = tile_nb
        if(rendered != null) this.rendered = rendered
    }
}