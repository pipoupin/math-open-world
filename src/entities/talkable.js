import { Game } from "../core/game.js";
import { Map } from "../world/map.js";
import { Ui } from "../ui/ui.js";
import { Hitbox } from "./hitbox.js";
import { constants } from "../constants.js";

export class Talkable{
    /**
     * 
     * @param {Game} game 
     * @param {Map} map 
     * @param {Hitbox} hitbox 
     * @param {Ui} ui 
     */
    constructor(game, map, hitbox, ui, entity=null){
        this.game = game
        this.map = map
        this.hitbox = hitbox
        this.ui = ui
        this.entity = entity

        this.game.talkables.push(this)
    }

    on_interact(){
        this.game.current_ui = this.ui
    }

    render() {
		if(this.game.get_current_map() == this.map){
			this.game.ctx.strokeStyle = "green"
			this.game.ctx.strokeRect(
				this.hitbox.x1 - this.game.camera.x,
				this.hitbox.y1 - this.game.camera.y,
				this.hitbox.width,
				this.hitbox.height
			)
		}
	}

    update(){
        if(this.game.inputHandler.keys[constants.INTERACTION_KEY]){
            if(this.game.player.raycast_hitbox.is_colliding(this.hitbox)){
                this.on_interact()
            }
        }
        if(this.entity)
            this.hitbox.center_around(this.entity.x, this.entity.y)
    }

    destructor(){
        this.game.talkables.slice(this.game.talkables.indexOf(this), 1)
    }
}