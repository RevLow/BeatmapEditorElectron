import DRAW_MODE from "../app/draw_mode.js";
export default class NavBarStore {
  set active(mode) { this._active = mode; }
  get active() { return this._active; }
  constructor() {
    riot.observable(this);
    this._active = DRAW_MODE.move;
  }
}