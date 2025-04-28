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

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Array<Widget>}
     */
    async make_widget(x, y){
        var texture = await Texture.create(this.game, this.item.name + "-texture", this.item.src,
            x, y, constants.TILE_SIZE / 8, constants.TILE_SIZE / 8, false)

        var label = new Label(this.game, this.item.name + "-label",
            x + constants.TILE_SIZE / 16, y, /** we'll need to tweak this */
            this.count.toString(), false, constants.TILE_SIZE / 4)

        return [texture, label]
    }
}