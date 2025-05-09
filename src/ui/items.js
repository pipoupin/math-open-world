import { constants } from "../constants.js"
import { Game } from "../core/game.js"
import { Label, Texture, Widget } from "./widgets.js"

export class Item{
    /**
     * 
     * @param {Game} game 
     * @param {String} src 
     * @param {String} name 
     */
    constructor(game, src, name){
        this.game = game
        this.src = src
        this.name = name
    }
}

export class Consumable extends Item{
    /**
     * 
     * @param {Game} game 
     * @param {String} name 
     * @param {(consumable: Consumable) => void} on_use 
     */
    constructor(game, src, name, on_use){
        super(game, src, name)
        this.on_use = on_use
    }
}

export class ItemStack{

    /**
     * 
     * @param {Item} item 
     * @param {Number} count 
     */
    constructor(item, count){
        this.game = item.game
        this.item = item
        this.count = count
    }

    /**
     * 
     * @param {Number} n 
     */
    add_count(n){
        if(this.count < -n) console.error("Negative item count")
        this.count += n
    }
}