import { config, constants } from "../constants.js";
import { Game } from "../core/game.js";
import { Item, ItemStack } from "./items.js";
import { Ui } from "./ui.js";
import { Button, Texture, Widget } from "./widgets.js";

export class Inventory extends Ui{
    /**
     * 
     * @param {Game} game 
     * @param {Array<Texture>} textures_array 
     * @param {Texture} hovered_texture 
     */
    constructor(game, textures_array, hovered_texture){
        /**@type {Array<Widget>} */
        var widgets = []
        for(let i=0; i<9; i++){
            widgets.push(new Button(game, `inventory-button-${i}`,
                Inventory.get_slot_coordinates(i).x, Inventory.get_slot_coordinates(i).y,
                constants.TILE_SIZE, constants.TILE_SIZE, true,
                (button) => {

                }))
        }
        textures_array.forEach(texture => {widgets.push(texture)})
        widgets.push(hovered_texture)
        /**@type {(inv: Inventory) => void} */
        var widgets_states_handler = (inv)=>{
            var hovered_icon = inv.get_widget("hovered_icon")
            var has_hovered = false
            
            for(let i = 0; i < 9; i++){
                if(inv.get_widget(`inventory-button-${i}`).is_hovered){
                    hovered_icon.update_config(0, 0, null, null, true)
                    has_hovered = true
                }
            }
            
            if(!has_hovered)
                hovered_icon.rendered = false
        }
        super(game, game.canvas.width, game.canvas.height, widgets, widgets_states_handler)
        /** @type {Array<Array<ItemStack>>} */
        this.itemstacks = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]
    }

    /**
     * 
     * @param {Game} game 
     * @param {String} src 
     * @returns {Promise<Inventory>}
     */
    static async create(game, src){
        let hovered_texture = await Texture.create(game, "hovered-texture", "inventory_hovered_tileset.png", 0, 0, constants.TILE_SIZE / 8, constants.TILE_SIZE / 8, false)
        let textures_array = []
        for(let i=0; i<9; i++){
            textures_array.push(await Texture.create(game, `item-texture-${i}`, null, Inventory.get_slot_coordinates(i).x, Inventory.get_slot_coordinates(i).y, constants.TILE_SIZE, constants.TILE_SIZE, false))
        }
        var inventory = new Inventory(game, textures_array, hovered_texture)
        try{
            await inventory.load(config.IMG_DIR + src)
        }catch (error){
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
        }
        return inventory
    }

    update(current_time){
        if(this.game.current_ui === this)
            super.update(current_time)
        else
            if(this.game.current_ui) return
            if(this.game.inputHandler.isKeyPressed("e")){
                this.game.current_ui = this
            }
        for(let i = 0; i < 9; i++){
            if(this.get_slot(i)){
                if(this.get_slot(i).count == 0){
                    this.get_widget(this.get_slot(i).item.name + "-texture").destructor()
                    this.get_widget(this.get_slot(i).item.name + "-label").destructor()
                }
            }
        }
    }

    /**
     * 
     * @param {Item} item 
     * @returns {Number}
     */
    get_next_empty_slot(item){
        for(let i = 0; i < 9; i++){
            if(this.get_slot(i).item == item) return i
        }
        for(let i = 0; i < 9; i++){
            if(this.get_slot(i) == null) return i
        }
    }

    /**
     * 
     * @param {Number} n 
     * @returns {ItemStack}
     */
    get_slot(n){
        return this.itemstacks[Math.floor(n / 3)][n % 3]
    }

    /**
     * 
     * @param {Number} n 
     * @param {ItemStack} itemstack 
     */
    set_slot(n, itemstack){
        this.itemstacks[Math.floor(n / 3)][n % 3] = itemstack
    }

    /**
     * 
     * @param {Number} n 
     * @returns {{x: Number; y: Number}}
     */
    static get_slot_coordinates(n){
        return {
            x: ((n % 3) * constants.TILE_SIZE * 1.1) - (constants.TILE_SIZE * 1.6),
            y: (Math.floor(n / 3) * constants.TILE_SIZE * 1.1) - (constants.TILE_SIZE * 1.6)
        }
    }

    /**
     * 
     * @param {Array<ItemStack>} itemstacks 
     */
    async add_items(itemstacks){
        for(let itemstack of itemstacks){
            var slot = this.get_next_empty_slot(itemstack.item)
            await this.get_widget(`item-texture-${slot}`).change_image(itemstack.item.src)
            this.get_widget(`item-texture-${slot}`).rendered = true
            this.set_slot(slot, itemstack)
        }
    }
}
