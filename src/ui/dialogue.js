import { config, constants } from "../constants.js";
import { Game } from "../core/game.js";
import { slice } from "../utils.js";
import { Tileset } from "../world/tileset.js";
import { Ui } from "./ui.js";
import { Button, Icon, Label } from "./widgets.js";

export class Dialogue extends Ui{

    /**
     * !!! One shouldn't use the constructor to make an dialogue, use the static create method instead
     * @param {Game} game 
     * @param {String} text 
     * @param {Tileset} arrow_tileset 
     * @param {(d: Dialogue) => void} on_end 
     * @param {Number} fontsize 
     * @param {String} textcolor 
     * @param {string} font 
     */
    constructor(game, text, arrow_tileset, on_end, fontsize, textcolor, font){
        var widgets = [new Label(game, "dialogue-content",
            - game.canvas.width / 2 + 100, game.canvas.height / 2 - 50, "",
            true, fontsize, textcolor, font),
            new Button(game, "new-line-button",
                - game.canvas.width / 2, - game.canvas.height / 2, game.canvas.width, game.canvas.height,
                true, (button) => button.ui.next()),
            new Icon(game, "arrow-icon", game.canvas.width / 9 * 4, game.canvas.height / 9 * 4,
                arrow_tileset, 1, false)
        ]

        var widgets_states_handler = (dialogue) => {

        }

        super(game, game.canvas.width, game.canvas.height, widgets, widgets_states_handler)

        this.text = text
        this.on_end = on_end
        this.last_time = 0
        
        this.sentences = slice(text, Math.round(2300 / fontsize))
        this.sentence = 0
    }

    /**
     * Method used to build an dialogue. This method is async and static
     * @param {Game} game - The dialogue's game
     * @param {String} src - The dialogue's background's path
     * @param {String} text - The content of the dialogue
     * @param {(d: Dialogue) => void} [on_end = (d: Dialogue) => {}] - The command executed at the end of the dialogue
     * @param {Number} fontsize - Dialogue's text's font size
     * @param {String} [textcolor="black"] - Dialogue's text's color
     * @param {string} [font="arial"] - Dialogue's text's font
     * @returns {Dialogue}
     */
    static async create(game, src, text, on_end=(d) => {}, fontsize=15, textcolor="black", font="arial"){
        let arrow_tileset = await Tileset.create(game, config.IMG_DIR+"arrow.png", 15, 16, 0)
        const dialogue = new Dialogue(game, text, arrow_tileset, on_end, fontsize, textcolor, font)
        try {
			await dialogue.load(src)
		} catch (error) {
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
		}
		return dialogue
    }

    update(current_time){
        super.update(current_time)
        if(current_time - this.last_time < 100) return
        this.last_time = current_time
        /** @type {Label} */
        var label = this.get_widget("dialogue-content")
        if(label.text == this.sentences[this.sentence]) return
        label.text = label.text+this.sentences[this.sentence].at(label.text.length)

        if(label.text == this.sentences[this.sentence])
            this.get_widget("arrow-icon").rendered = true
        else
            this.get_widget("arrow-icon").rendered = false
    }

    next(){
        /** @type {Label} */
        var label = this.get_widget("dialogue-content")
        if(label.text != this.sentences[this.sentence]){
            label.text = this.sentences[this.sentence]
            this.get_widget("arrow-icon").rendered = true
            return
        }
        if(this.sentence + 1 == this.sentences.length){
            this.is_finished = true
            this.sentence = 0
            label.text = ""
            this.on_end(this)
            return
        }
        this.sentence += 1
        label.text = ""
    }
}

export class QuestionDialogue extends Ui{
    /**
     * !!! One shouldn't use the constructor to make an dialogue, use the static create method instead
     * @param {Game} game 
     * @param {String} text 
     * @param {Tileset} arrow_tileset 
     * @param {Array<String>} anwsers 
     * @param {Number} anwsers_x 
     * @param {Number} anwsers_y 
     * @param {Number} anwsers_width 
     * @param {Number} anwsers_height 
     * @param {Tileset} anwser_box_tileset 
     * @param {(d: Dialogue, a: String) => void} on_end 
     * @param {Number} fontsize 
     * @param {String} textcolor 
     * @param {string} font 
     */
    constructor(game, text, arrow_tileset, anwsers, anwsers_x, anwsers_y, anwsers_width, anwsers_height, anwser_box_tileset, on_end, fontsize, textcolor, font){
        var widgets = [new Label(game, "dialogue-content",
            - game.canvas.width / 2 + 100, game.canvas.height / 2 - 50, "",
            true, fontsize, textcolor, font),
            new Button(game, "new-line-button",
                - game.canvas.width / 2, - game.canvas.height / 2, game.canvas.width, game.canvas.height,
                true, (button) => button.ui.next()),
            new Icon(game, "arrow-icon", game.canvas.width / 9 * 4, game.canvas.height / 9 * 4,
                arrow_tileset, 1, false)
        ]

        for(let i = 0; i < anwsers.length; i++){

            for(let j = 0; j < anwsers_width/anwsers_height; j++){
                let tile_nb = i == 0? 7: i + 1 == anwsers.length? 1: 4
                tile_nb += j == 0? 0: j + 1 >= anwsers_width/anwsers_height? 2: 1
                widgets.push(new Icon(game, `anwsers-box-icon-${i}-${j}`,
                    anwsers_x + j * anwsers_height, anwsers_y - ((i + 1) * anwsers_height), anwser_box_tileset, tile_nb, false))

            }

            widgets.push(new Button(game, "anwser-button-"+i.toString(),
            anwsers_x, anwsers_y - ((i + 1) * anwsers_height), anwsers_width, anwsers_height, false, (button) => {
                if(!button.has_focus) return
                if(button.ui.sentence + 1 != button.ui.sentences.length || button.ui.get_widget("dialogue-content").text != button.ui.sentences[this.sentence]) return
                let anwser_number = parseInt(button.id.split("-").at(-1))
                this.is_finished = true
                button.ui.on_end(button.ui, button.ui.anwsers[anwser_number])
            }
            ))

            widgets.push(new Label(game, "anwser-label-"+i.toString(),
                anwsers_x * 1.05, anwsers_y - ((i + 0.5) * anwsers_height) + 7.5, anwsers[i], false, fontsize, textcolor, font
            ))

            widgets.push(new Icon(game, "anwser-arrow-"+i.toString(),
            anwsers_x + anwsers_width * 0.9, anwsers_y - ((i + 0.75) * anwsers_height), arrow_tileset, 4, false))
        }

        var widgets_states_handler = (dialogue) => {
            for(let i = 0; i < anwsers.length; i++){
                if(dialogue.get_widget("anwser-button-"+i.toString()).has_focus){
                    dialogue.get_widget("anwser-arrow-"+i.toString()).rendered = true
                } else {
                    dialogue.get_widget("anwser-arrow-"+i.toString()).rendered = false
                }
            }
        }

        super(game, game.canvas.width, game.canvas.height, widgets, widgets_states_handler)

        this.text = text
        this.anwsers = anwsers
        this.on_end = on_end
        this.last_time = 0
        
        this.sentences = slice(text, Math.round(2300 / fontsize))
        this.sentence = 0
    }

    /**
     * Method used to build an dialogue. This method is async and static
     * @param {Game} game - The dialogue's game
     * @param {String} src - The dialogue's background's path
     * @param {String} text - The content of the dialogue
     * @param {Array<String>} anwsers - The possible anwsers to the question
     * @param {Number} anwsers_x - The anwsers' box's bottom left corner's x coordinate
     * @param {Number} anwsers_y - The anwsers' box's bottom left corner's y coordinate
     * @param {Number} anwsers_width - The width of the anwsers' box
     * @param {Number} anwsers_height - The height of one anwser in the anwsers' box
     * @param {String} anwser_box_tileset_src - The box drawing tileset's path
     * @param {(d: Dialogue, a: String) => void} [on_end = (d: Dialogue, a: String) => {}] - The command executed at the end of the dialogue
     * @param {number} [fontsize=15] - Dialogue's text's font size
     * @param {String} [textcolor="black"] - Dialogue's text's color
     * @param {string} [font="arial"] - Dialogue's text's font
     * @returns {Dialogue}
     */
    static async create(game, src, text, anwsers, anwsers_x, anwsers_y, anwsers_width, anwsers_height, anwser_box_tileset_src, on_end=(d, a) => {}, fontsize=15, textcolor="black", font="arial"){
        anwsers_width = Math.round(anwsers_width)
        anwsers_height = Math.round(anwsers_height)
        let arrow_tileset = await Tileset.create(game, config.IMG_DIR+"arrow.png", 15, 16, 0)
        let anwser_box_tileset = await Tileset.create(game, anwser_box_tileset_src, 16, anwsers_height, 0)
        const dialogue = new QuestionDialogue(game, text, arrow_tileset, anwsers, anwsers_x, anwsers_y, anwsers_width, anwsers_height, anwser_box_tileset, on_end, fontsize, textcolor, font)
        try {
			await dialogue.load(src)
		} catch (error) {
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
		}
		return dialogue
    }

    update(current_time){
        super.update(current_time)

        if(current_time - this.last_time < 100) return
        this.last_time = current_time
        
        /** @type {Label} */
        var label = this.get_widget("dialogue-content")
        
        if(label.text == this.sentences[this.sentence]) return
        label.text = label.text+this.sentences[this.sentence].at(label.text.length)

        if(label.text == this.sentences[this.sentence]){

            this.get_widget("arrow-icon").rendered = true
        
            if(this.sentence + 1 == this.sentences.length){
                
                this.get_widget("arrow-icon").rendered = false

                for(let i = 0; i < this.anwsers.length; i++){
                    this.get_widget("anwser-button-"+i.toString()).rendered = true
                    this.get_widget("anwser-label-"+i.toString()).rendered = true
                    for(let j = 0; j < this.get_widget("anwser-button-0").side_ratio(); j++){
                        this.get_widget(`anwsers-box-icon-${i}-${j}`).rendered = true
                    }
                }
            }
        } else {
            this.get_widget("arrow-icon").rendered = false
        }
    }

    next(){
        /** @type {Label} */
        var label = this.get_widget("dialogue-content")
        if(label.text != this.sentences[this.sentence]){
            label.text = this.sentences[this.sentence]

            this.get_widget("arrow-icon").rendered = true

            if(this.sentence + 1 == this.sentences.length){

                this.get_widget("arrow-icon").rendered = false

                for(let i = 0; i < this.anwsers.length; i++){
                    this.get_widget("anwser-button-"+i.toString()).rendered = true
                    this.get_widget("anwser-label-"+i.toString()).rendered = true
                    for(let j = 0; j < this.get_widget("anwser-button-0").side_ratio(); j++){
                        this.get_widget(`anwsers-box-icon-${i}-${j}`).rendered = true
                    }
                }
            }

            return
        }
        if(this.sentence + 1 == this.sentences.length) return
        this.sentence += 1
        label.text = ""
    }
}