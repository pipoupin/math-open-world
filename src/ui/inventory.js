import { Game } from "../core/game.js";
import { Ui } from "./ui.js";

/**
 * Inventory is a UI element that represents the player's inventory in the game.
 */
export class Inventory extends Ui {
    /**
     * !!! One shouldn't use the constructor to make an inventory, use the static create method instead
     * @param {Game} game - The current game
     * @param {Number} width - The Inventory's width on the screen
     * @param {Number} height - The Inventory's height on the screen
     * @param {Array<Item>} items - The list of items in the inventory
     * @param {(inventory: Inventory) => void} items_state_handler - Method to handle item states (like items being 'clicked' or 'selected'), executed at each update
     */
    constructor(game, width, height, items, items_state_handler) {
        super(game, width, height, items, items_state_handler);
        this.items = items;
    }

    /**
     * Inventories are UIs that display and manage items. The create method is async and static.
     * @param {Game} game - The current game
     * @param {String} src - The path to the image used as a background for the UI
     * @param {Number} width - The Inventory's width on the screen
     * @param {Number} height - The Inventory's height on the screen
     * @param {Array<Item>} items - The list of items in the inventory
     * @param {(inventory: Inventory) => void} items_state_handler - Method to handle item states (like items being 'clicked' or 'selected'), executed at each update
     */
    static async create(game, src, width, height, items, items_state_handler) {
        const inventory = new Inventory(game, width, height, items, items_state_handler);
        try {
            await inventory.load(src);
        } catch (error) {
            console.error(`Couldn't load file "${src}": ${error.message}`);
            return;
        }
        return inventory;
    }
}
