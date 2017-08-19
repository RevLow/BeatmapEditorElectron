/**
 * 書き込むデータを管理する
 * 
 * grid: グリッド分割数
 * bpm: BPM
 * time: 現在表示時間
 * maxTime: 最大表示時間
 * size: キャンバスサイズ
 *   width: 幅
 *   height: 高さ
 * notes: 描画するノーツ配列
 *   time: ノーツの開始時間
 *   type: normal? star? swing?
 *   lane: レーン番号
 */
import DRAW_MODE from "../app/draw_mode.js";
export default class BeatmapEditorStore {
  get size() {
    return {
      width: this._width,
      height: this._height
    }
  }
  get grid() { return this._grid; }
  get bpm() { return this._bpm; }
  get time() { return this._time; }
  get maxTime() { return this._maxTime; }
  get notes() { return this._notes; }
  get mode() { return this._mode; }
  set size({ width=0, height=0 }) {
    this._width = width;
    this._height = height;
  }
  set mode(m) { this._mode = m; }

  constructor() {
    riot.observable(this);
    this._width = 0;
    this._height = 0;
    this._stage = null;
    this._renderer = null;
    this._bpm = 120;
    this._grid = 4;
    this._time = 0;
    this._maxTime = 300;
    this._notes = [];
    this._mode = DRAW_MODE.draw;
    this._note_width = 200;
    this._note_height = 50;
  }

  init({ view, width=0, height=0 }) {
    this._width = width;
    this._height = height;
    this.__initPixi__(view);
    this._note_width = width / 9.0;    
    this._renderer.render(this._stage);
  }

  addNotes(x, y) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x00FF00);
    graphics.drawRect(x, y, this._note_width, this._note_height);

    this._stage.addChild(graphics);
    this._renderer.render(this._stage);
  }

  resized({width, height}){
    this._width = width;
    this._height = height;
    this._note_width = width / 9.0;
    for(let note_index in this._stage.children) {
      let note = this._stage.children[note_index];
      note.width = this._note_width;
    }

    this._renderer.resize(width, height);
    /*
      this._renderer.view.width = width;
      this._renderer.view.height = height;
    */
    this._renderer.render(this._stage);    
  }

  __initPixi__(_view) {
    this._stage = new PIXI.Stage(0x000000);
    this._renderer = PIXI.autoDetectRenderer(this._width, this._height,{
      view: _view
    });
  }
}