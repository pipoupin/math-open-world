import { Game } from "./game.js"

export class InputHandler {
    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        this.keys = {}
        this.del_key_can_be_pressed = true
        this.mouse_pos = {x:null, y:null}

        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true
            if(e.key == "Backspace" && this.del_key_can_be_pressed){
                if(game.current_ui && game.current_ui.selected_textarea){
                    game.current_ui.selected_textarea.content = game.current_ui.selected_textarea.content.slice(0, -1)
                    console.log(game.current_ui.selected_textarea.content)
                    this.del_key_can_be_pressed = false
                }
            }
        })

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false
            if(e.key == "Backspace") this.del_key_can_be_pressed = true
        })

        document.onmousemove = (e) => this.mouse_pos = {x:e.x, y:e.y}

        document.addEventListener('click', (e) => {
            if(game.current_ui){
                game.current_ui.widgets.forEach(widget =>{
                    if(widget.x <= this.mouse_pos.x
                        && (widget.x + widget.width) >= this.mouse_pos.x
                        && widget.y <= this.mouse_pos.y
                        && (widget.y + widget.height) >= this.mouse_pos.y){

                            widget.has_focus = true
                            if(game.current_ui.focused_widget) game.current_ui.focused_widget.has_focus = false
                            game.current_ui.focused_widget = widget

                            if(widget.type == "button") widget.command(widget)

                            if(widget.type == "textarea"){
                                if(game.current_ui.selected_textarea) game.current_ui.selected_textarea.selected = false
                                widget.selected = true
                                game.current_ui.selected_textarea = widget
                            } else {
                                if(game.current_ui.selected_textarea){
                                    game.current_ui.selected_textarea.selected = false
                                    game.current_ui.selected_textarea = null
                                }
                            }
                    }else {
                        if(game.current_ui.selected_textarea){
                            game.current_ui.selected_textarea.selected = false
                            game.current_ui.selected_textarea = null
                        }
                    }
                })
            }
        })

        document.addEventListener("keypress", (e) => {
            if(game.current_ui && game.current_ui.selected_textarea){
                if(game.current_ui.selected_textarea.content.length != game.current_ui.selected_textarea.max_char_number){
                    game.current_ui.selected_textarea.content += e.key
                }
            }
        })
    }

    isKeyPressed(key) { return this.keys[key] }
}
