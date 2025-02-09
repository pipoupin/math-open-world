export class InputHandler {
    constructor() {
        this.keys = {}
        document.addEventListener('keydown', (e) => this.keys[e.key] = true)
        document.addEventListener('keyup', (e) => this.keys[e.key] = false)
    }

    isKeyPressed(key) { return this.keys[key] }
}
