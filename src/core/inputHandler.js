import { constants } from "../constants.js"
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
                game.current_ui.widgets.forEach(widget => {
                    if(widget.x <= this.mouse_pos.x
                        && (widget.x + widget.width) >= this.mouse_pos.x
                        && widget.y <= this.mouse_pos.y
                        && (widget.y + widget.height) >= this.mouse_pos.y){
                            if(widget.type == constants.BUTTON_TYPE
                                || widget.type == constants.TEXTAREA_TYPE
                                || widget.type == constants.NUMBERAREA_TYPE){

                                if(widget.type == constants.BUTTON_TYPE) {
                                    widget.command(widget)
                                }

                                if(widget.type == constants.TEXTAREA_TYPE || widget.type == constants.NUMBERAREA_TYPE){
                                    if(game.current_ui.selected_textarea)
                                        game.current_ui.selected_textarea.selected = false
                                    widget.selected = true
                                    game.current_ui.selected_textarea = widget
                                } else {
                                    if(game.current_ui.selected_textarea){
                                        game.current_ui.selected_textarea.selected = false
                                        game.current_ui.selected_textarea = null
                                    }
                                }

                                return
                            }
                    }
                })
                game.selected_textarea = null
                if(game.current_ui.focused_widget)
                    game.current_ui.focused_widget.has_focus = false
                game.current_ui.focused_widget = null
            }
        })

        document.addEventListener("keypress", (e) => {
            if(game.current_ui && game.current_ui.selected_textarea && e.key.length == 1){
                if(game.current_ui.selected_textarea.content.length != game.current_ui.selected_textarea.max_char_number){
                    if(game.current_ui.selected_textarea.type == constants.NUMBERAREA_TYPE
                        && !(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key))) return
                    game.current_ui.selected_textarea.content += e.key
                }
            }
        })

        document.addEventListener("mousedown", (e) => {
            if(game.current_ui){
                game.current_ui.widgets.forEach(widget => {
                    if(widget.x <= this.mouse_pos.x
                        && (widget.x + widget.width) >= this.mouse_pos.x
                        && widget.y <= this.mouse_pos.y
                        && (widget.y + widget.height) >= this.mouse_pos.y){
                            if(widget.type == constants.BUTTON_TYPE
                                || widget.type == constants.TEXTAREA_TYPE
                                || widget.type == constants.NUMBERAREA_TYPE){
                                widget.is_clicked = true
                                widget.has_focus = true
                                if(game.current_ui.focused_widget)
                                    game.current_ui.focused_widget.has_focus = false
                                game.current_ui.focused_widget = widget
                            }
                    }
                })
            }
        })

        document.addEventListener("mouseup", (e) => {
            if(game.current_ui){
                game.current_ui.widgets.forEach((widget) => {
                    if(widget.type == constants.BUTTON_TYPE
                        || widget.type == constants.TEXTAREA_TYPE
                        || widget.type == constants.NUMBERAREA_TYPE){
                        widget.is_clicked = false
                    }
                })
            }
        })
    }

    isKeyPressed(key) { return this.keys[key] }
}
