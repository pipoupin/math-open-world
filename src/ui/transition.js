import { Game } from "../core/game.js"

export class Transition{
    /**
     * 
     * @param {Game} game 
     * @param {Number} duration 
     */
    constructor(game, duration){
        this.game = game
        this.duration = duration
        this.is_finished = false
    }

    /**
     * 
     * @param {Number} current_time 
     */
    start(current_time){
        this.start_time = current_time
        this.game.current_ui = this
    }

    /**
     * 
     * @param {Number} current_time 
     */
    update(current_time){
        if(this.start_time + this.duration < current_time){
            this.is_finished = true
        }
    }

    render(){}
}

export class UnicoloreTransition extends Transition{

    /**
     * 
     * @param {Game} game 
     * @param {Number} duration 
     * @param {String} color 
     */
    constructor(game, duration, color){
        super(game, duration)
        this.color = color
    }

    render(){
        this.game.ctx.fillStyle = this.color
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
    }
}
