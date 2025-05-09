import { config } from "../constants.js"
import { Game } from "../core/game.js"

export class Item{
    /**
     * 
     * @param {Game} game 
     * @param {String} name 
     */
    constructor(game, name){
        this.game = game
        this.name = name
        this.game.items[name] = this
    }

    static async create(game, src, name){
        let item = new Item(game, name)
        try{
            item.load(config.IMG_DIR + src)
        } catch (error){
            console.error(`Couldn't load file "${src}": ${error.message}`);
        }
        return item
    }

    async load(src){
        const img = new Image();
        img.src = src;
        this.img = img;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });
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