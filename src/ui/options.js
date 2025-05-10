import { constants, config } from "../constants.js";
import { Game } from "../core/game.js";
import { Ui } from "./ui.js";
import { Button, Icon } from "./widgets.js"

export class OptionsMenu extends Ui{
    /**
     * 
     * @param {Game} game 
     */
    constructor(game){
        super(game, constants.TILE_SIZE * 6 * 0.8, constants.TILE_SIZE * 5 * 0.8, [
            new Button(game, "music-volume-button", constants.TILE_SIZE * 1.5, -constants.TILE_SIZE,
                constants.TILE_SIZE / 2, constants.TILE_SIZE / 2, true, (b) => {}),
            new Button(game, "sound-effects-volume-button", constants.TILE_SIZE * 1.5, constants.TILE_SIZE,
                constants.TILE_SIZE / 2, constants.TILE_SIZE / 2, true, (b) => {}),
            new Icon(game, "music-volume-cursor-icon", constants.TILE_SIZE * 1.5, -constants.TILE_SIZE,
                game.tilesets["selection_cursor"], 1, true, 1),
            new Icon(game, "sound-effects-volume-cursor-icon", constants.TILE_SIZE * 1.5, constants.TILE_SIZE,
                game.tilesets["selection_cursor"], 1, true, 1)
        ], ui => {
            let music_volume_button = ui.get_widget("music-volume-button")
            let sound_effects_volume_button = ui.get_widget("sound-effects-volume-button")
            if(music_volume_button.is_hovered || music_volume_button.is_clicked)
                ui.get_widget("music-volume-cursor-icon").tile_nb = 2
            else
                ui.get_widget("music-volume-cursor-icon").tile_nb = 1

            if(sound_effects_volume_button.is_hovered || sound_effects_volume_button.is_clicked)
                ui.get_widget("sound-effects-volume-cursor-icon").tile_nb = 2
            else
                ui.get_widget("sound-effects-volume-cursor-icon").tile_nb = 1

            if(music_volume_button.is_clicked){
                music_volume_button.x.set_value(Math.max(Math.min(
                    ui.game.inputHandler.mouse_pos.x - constants.TILE_SIZE / 4,
                    constants.TILE_SIZE * 1.5), - constants.TILE_SIZE * 1.5))
                ui.get_widget("music-volume-cursor-icon").x.set_value(music_volume_button.x.get())
                this.music_volume = Math.round((music_volume_button.x.get() +
                                                constants.TILE_SIZE * 1.5) / (constants.TILE_SIZE * 3) * 100)
            }
            if(sound_effects_volume_button.is_clicked){
                sound_effects_volume_button.x.set_value(Math.max(Math.min(
                    ui.game.inputHandler.mouse_pos.x - constants.TILE_SIZE / 4,
                    constants.TILE_SIZE * 1.5), - constants.TILE_SIZE * 1.5))
                ui.get_widget("sound-effects-volume-cursor-icon").x.set_value(sound_effects_volume_button.x.get())
                this.sound_effects_volume = Math.round((sound_effects_volume_button.x.get() +
                                                constants.TILE_SIZE * 1.5) / (constants.TILE_SIZE * 3) * 100)
            }
            if(this.game.inputHandler.isKeyPressed("escape")) this.is_finished = true
        })
        this.music_volume = 100
        this.sound_effects_volume = 100
    }

    /**
     * 
     * @param {Game} game 
     * @returns {Promise<OptionsMenu>}
     */
    static async create(game){
        var options = new OptionsMenu(game)
        let src = "options_menu.png"
        try {
            await options.load(config.IMG_DIR + src)
        } catch (error) {
            console.error(`couldn't load file "${src}" : ${error.message}`)
            return
        }
        return options
    }
}