import { Game } from "../core/game.js"

export class Transition{
    /**
     * !!! One shouldn't create a transition by using this constructor, use subclass transtions instead
     * @param {Game} game - The current game
     * @param {Number} duration - The duration of the transition
     * @param {(transition: Transition) => void} on_end - The function executed when the transition is finished, allows for scripts or ui to follow
     */
    constructor(game, duration, on_end){
        this.game = game
        this.duration = duration
        this.on_end = on_end
        this.is_finished = false
    }

    /**
     * 
     * @param {Number} time 
     */
    start(time){
        this.start_time = time
        this.game.current_ui = this
    }

    trigger(){
        this.start_time = null
        this.game.current_ui = this
    }

    /**
     * 
     * @param {Number} current_time 
     */
    update(current_time){
        if(this.start_time + this.duration < current_time){
            this.is_finished = true
            this.on_end(this)
        }
    }

    render(){}
}

export class UnicoloreTransition extends Transition{

    /**
     * 
     * @param {Game} game - The current game
     * @param {Number} duration - The duration of the transition
     * @param {String} color - The color of the screen during the transition
     * @param {(transition: UnicoloreTransition) => void} [on_end = (t) => {}] - The function executed when the transition is finished, allows for scripts or ui to follow
     */
    constructor(game, duration, color, on_end=(t) => {}){
        super(game, duration, on_end)
        this.color = color
    }

    render(){
        this.game.ctx.fillStyle = this.color
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
    }
}
