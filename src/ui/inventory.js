import { config, constants } from "../constants.js";
import { Game } from "../core/game.js";
import { Talkable } from "../entities/talkable.js";
import { Tileset } from "../world/tileset.js";
import { ItemStack } from "./items.js";
import { Ui } from "./ui.js";
import { Button, Texture } from "./widgets.js";

var inventory_side = Math.min(window.innerWidth,window.innerHeight) / 2
export class Inventory extends Ui{
    /**
     * 
     * @param {Game} game 
     * @param {Texture} hovered_texture 
     */
    constructor(game, hovered_texture){
        var widgets = [
            new Button(game, "inventory-button-0", constants.TILE_SIZE / 2 - 10, constants.TILE_SIZE / 2 -10,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            new Button(game, "inventory-button-1", constants.TILE_SIZE / 2, constants.TILE_SIZE / 2,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            new Button(game, "inventory-button-2", constants.TILE_SIZE / 2, constants.TILE_SIZE / 2,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            new Button(game, "inventory-button-3", constants.TILE_SIZE / 2, constants.TILE_SIZE / 2,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            new Button(game, "inventory-button-4", constants.TILE_SIZE / 2, constants.TILE_SIZE / 2,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            new Button(game, "inventory-button-5", constants.TILE_SIZE / 2, constants.TILE_SIZE / 2,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            new Button(game, "inventory-button-6", constants.TILE_SIZE / 2, constants.TILE_SIZE / 2,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            new Button(game, "inventory-button-7", constants.TILE_SIZE / 2, constants.TILE_SIZE / 2,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            new Button(game, "inventory-button-8", constants.TILE_SIZE / 2, constants.TILE_SIZE / 2,
                inventory_side / 3.85 , inventory_side / 3.85, true, (button) => {
                    // chais pas mdr
                }),
            hovered_texture,
            new Texture(game, "hovered_icon", -100, -100, constants.TILE_SIZE / 8, constants.TILE_SIZE / 8, false)
        ]
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
        super(game, inventory_side, inventory_side, widgets, widgets_states_handler)
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
     * @returns {Inventory}
     */
    static async create(game, src){
        let hovered_texture = await Texture.create(game, "hovered-texture", "inventory_hovered_tileset.png", 0, 0, constants.TILE_SIZE / 8, constants.TILE_SIZE / 8, false)
        var inventory = new Inventory(game, hovered_texture)
        try{
            await inventory.load(config.IMG_DIR + src)
        }catch (error){
			console.error(`couldn't load file "${src}" : ${error.message}`)
			return
        }
        return inventory
    }

    update(current_time) {    //update_config(x=null, y=null, width=null, height=null, rendered=null, command=null)
        inventory_side = Math.min(window.innerWidth,window.innerHeight) / 2
        for (let i = 0; i < 9; i++){
            this.get_widget(`inventory-button-${i}`).update_config(0, 0,inventory_side / 3.85 , inventory_side / 3.85)
        }   
        if (this.game.inputHandler.isKeyPressed("e")) {
            if (this.game.current_ui === this) {
                this.game.current_ui = null;
            } else if (!this.game.current_ui) {
                this.game.current_ui = this;
            }
        }
    
        if (this.game.current_ui === this) {
            super.update(current_time);
        }
    }

    /**
     * 
     * @returns {Number}
     */
    get_next_empty_slot(){
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
     * @param {Array<ItemStack>} itemstacks 
     */
    async add_items(itemstacks){
        for(let itemstack of itemstacks){
            let widgets = await itemstack.make_widget()
            widgets.forEach(widget => {
                this.add_widget(widget)
            })
            this.set_slot(this.get_next_empty_slot(), itemstack)
        }
    }
}
