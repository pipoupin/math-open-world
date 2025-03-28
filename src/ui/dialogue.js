import { Game } from "../core/game.js";
import { slice } from "../utils.js";
import { Ui } from "./ui.js";
import { Button, Label } from "./widgets.js";

export class Dialogue extends Ui{

    /**
     * !!! One shouldn't use the constructor to make an dialogue, use the static create method instead
     * @param {Game} game - The dialogue's game
     * @param {String} text - The content of the dialogue
     * @param {(d: Dialogue) => void} on_end - The command executed at the end of the dialogue
     * @param {String} textcolor - Label's text's color
     * @param {string} font - Label's text's font
     */
    constructor(game, text, on_end, textcolor, font){
        var widgets = [new Label(game, "dialogue-content",
            - game.canvas.width / 2 + 100, game.canvas.height / 2 - 50, "",
            true, 50, textcolor, font),
            new Button(game, "new-line-button", - game.canvas.width / 2, - game.canvas.height / 2, game.canvas.width, game.canvas.height, true, (button) => button.ui.next())
        ]

        var widgets_states_handler = (dialogue) => {

        }

        super(game, game.canvas.width, game.canvas.height, widgets, widgets_states_handler)

        this.text = text
        this.on_end = on_end
        this.last_time = 0
        
        this.sentences = slice(text, 50)
        console.log(this.sentences)
        this.sentence = 0
    }

    /**
     * Method used to build an dialogue. This method is async and static
     * @param {Game} game - The dialogue's game
     * @param {String} src - The dialogue's background's path
     * @param {String} text - The content of the dialogue
     * @param {(d: Dialogue) => void} [on_end = (d: Dialogue) => {}] - The command executed at the end of the dialogue
     * @param {String} [textcolor="black"] - Label's text's color
     * @param {string} [font="arial"] - Label's text's font
     * @returns {Dialogue}
     */
    static async create(game, src, text, on_end=(d) => {}, textcolor="black", font="arial"){
        const dialogue = new Dialogue(game, text, on_end, textcolor, font)
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
        if(current_time - this.last_time < 150) return
        this.last_time = current_time
        /** @type {Label} */
        var label = this.get_widget("dialogue-content")
        if(label.text == this.sentences[this.sentence]) return
        label.update_config(null, null, label.text+this.sentences[this.sentence].at(label.text.length))
    }

    next(){
        /** @type {Label} */
        var label = this.get_widget("dialogue-content")
        if(label.text != this.sentences[this.sentence]){
            label.update_config(null, null, this.sentences[this.sentence])
            return
        }
        if(this.sentence + 1 == this.sentences.length){
            this.is_finished = true
            this.sentence = 0
            label.update_config(null, null, "")
            this.on_end(this)
            return
        }
        this.sentence += 1
        label.update_config(null, null, "")
    }
}