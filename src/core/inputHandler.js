import { constants } from "../constants.js"
import { Ui } from "../ui/ui.js"
import { Game } from "./game.js"

export class InputHandler {
    /**
     * @param {Game} game 
     */
    constructor(game) {
        this.keys_down = {}
        this.keys_pressed = {}
        this.del_key_can_be_pressed = true
        this.mouse_pos = {x:null, y:null}

        document.addEventListener('keydown', (e) => {
            if (!this.keys_down[e.key.toLowerCase()]) {
                this.keys_pressed[e.key.toLowerCase()] = true
            }
            this.keys_down[e.key.toLowerCase()] = true
            if(e.key == "Backspace" && this.del_key_can_be_pressed){
                if(game.current_ui && game.current_ui.focused_widget){
                    game.current_ui.focused_widget.content = game.current_ui.focused_widget.content.slice(0, -1)
                    this.del_key_can_be_pressed = false
                }
            }
        })

        document.addEventListener('keyup', (e) => {
            this.keys_down[e.key.toLowerCase()] = false
            this.keys_pressed[e.key.toLowerCase()] = false
            if(e.key == "Backspace") this.del_key_can_be_pressed = true
        })

        document.onmousemove = (e) => {
            this.mouse_pos = {
                    x: e.x - (game.canvas.width / 2), 
                    y: e.y - (game.canvas.height / 2)
                }
        }

        document.addEventListener('click', (e) => {
            if(game.current_ui && game.current_ui instanceof Ui){
                var widget_clicked = false
                game.current_ui.widgets.forEach(widget => {
                    if(widget.x <= this.mouse_pos.x
                        && (widget.x + widget.width) >= this.mouse_pos.x
                        && widget.y <= this.mouse_pos.y
                        && (widget.y + widget.height) >= this.mouse_pos.y){
                            if(!widget.rendered) return
                            if(widget.type == constants.BUTTON_TYPE
                                || widget.type == constants.TEXTAREA_TYPE
                                || widget.type == constants.NUMBERAREA_TYPE){

                                if(widget.type == constants.BUTTON_TYPE) {
                                    widget.command(widget)
                                    if(game.current_ui.focused_widget)
                                        game.current_ui.focused_widget.has_focus = false
                                    widget.has_focus = true
                                    game.current_ui.focused_widget = widget
                                }

                                if(widget.type == constants.TEXTAREA_TYPE || widget.type == constants.NUMBERAREA_TYPE){
                                    if(game.current_ui.focused_widget)
                                        game.current_ui.focused_widget.has_focus = false
                                    widget.has_focus = true
                                    game.current_ui.focused_widget = widget
                                } else {
                                    if(game.current_ui.focused_widget){
                                        game.current_ui.focused_widget.has_focus = false
                                        game.current_ui.focused_widget = null
                                    }
                                }
                                widget_clicked = true
                            }
                    }
                })
                if(!widget_clicked){
                    game.focused_widget = null
                    if(game.current_ui.focused_widget)
                        game.current_ui.focused_widget.has_focus = false
                    game.current_ui.focused_widget = null
                }
            }
        })

        document.addEventListener("keypress", (e) => {
            if(game.current_ui && game.current_ui.focused_widget && e.key.length == 1){
                if(game.current_ui.focused_widget.content.length != game.current_ui.focused_widget.max_char_number){
                    if(game.current_ui.focused_widget.type == constants.NUMBERAREA_TYPE
                        && !(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key))) return
                    game.current_ui.focused_widget.content += e.key
                }
            }
        })

        // document.addEventListener("mousedown", (e) => {
        //     if(game.current_ui){
        //         game.current_ui.widgets.forEach(widget => {
        //             if(widget.x <= this.mouse_pos.x
        //                 && (widget.x + widget.width) >= this.mouse_pos.x
        //                 && widget.y <= this.mouse_pos.y
        //                 && (widget.y + widget.height) >= this.mouse_pos.y){
        //                     if(widget.type == constants.BUTTON_TYPE
        //                         || widget.type == constants.TEXTAREA_TYPE
        //                         || widget.type == constants.NUMBERAREA_TYPE){
        //                         widget.is_clicked = true
        //                         widget.has_focus = true
        //                         if(game.current_ui.focused_widget)
        //                             game.current_ui.focused_widget.has_focus = false
        //                         game.current_ui.focused_widget = widget
        //                     }
        //             }
        //         })
        //     }
        // })

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

    /**
     * 
     * @param {String} key 
     * @returns {Boolean}
     */
    isKeyDown(key) { return this.keys_down[key] }

    /**
     * 
     * @param {String} key 
     * @returns {Boolean}
     */
    isKeyPressed(key) {
        if (this.keys_pressed[key]) {
            this.keys_pressed[key] = false
            return true
        } else {
            return false
        }
    }
}
