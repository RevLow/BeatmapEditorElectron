/**
 * 書き込むデータを管理する
 * 
 * grid: グリッド分割数
 * sub: 拍子数(4/4など)
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
import DRAW_MODE from "../app/draw_mode";
import ScrollContainer from "../app/scrollcontainer";
const MEASURE_SIZE = 160;

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
    this._grid = 8;
    this._sub = 4;
    this._time = 0;
    this._maxTime = 300000;
    this._notes = [];
    this._mode = DRAW_MODE.draw;
    this._note_width = 200;
    this._note_height = 10;
  }

  init({ view, width=0, height=0 }) {
    this._width = width;
    this._height = height;
    this.__initPixi__(view);
    this._note_width = width / 9.0;
    this._vertical_grid_container = new PIXI.Container();
    this._horizontal_grid_container = new PIXI.Container();
    this._notes_container = new PIXI.Container();
    this.drawHorizontalGrid();
    this._stage.addChild(this._vertical_grid_container);   
    this._stage.addChild(this._horizontal_grid_container);
    this._stage.addChild(this._notes_container);
    this._renderer.render(this._stage);
  }

  addNotes(x, y) {
    let fixed_x = (~~(x / this._note_width)) * this._note_width;
    let fixed_y = (~~(y / this._note_height)) * this._note_height;

    let graphics = new PIXI.Graphics();
    this.drawRect(graphics, fixed_x, fixed_y, this._note_width, this._note_height);
    this._notes_container.addChild(graphics);
    this._renderer.render(this._stage);
  }

  drawRect(graphics, x, y, width, height){
    graphics.beginFill(0x00FF00);
    graphics.drawRect(x, y, width, height);
    graphics.endFill();  
  }

  drawHorizontalGrid() {
    this._horizontal_grid_container.removeChildren();
    // draw horizontal lines
    let sub_height = MEASURE_SIZE / this._sub;
    let grid_height = MEASURE_SIZE / this._grid;
    let graphics = new PIXI.Graphics();

    for(let n = 0;n < this._height;n+=grid_height){
      if(n % sub_height == 0) continue;
      graphics.lineStyle(2, 0xffffff).moveTo(0, n).lineTo(this._width, n).endFill();      
    }

    for(let n = 0;n < this._height;n+=sub_height){
      let color = n % MEASURE_SIZE == 0 ? 0xff0000 : 0xffffff;     
      graphics.lineStyle(4, color).moveTo(0, n).lineTo(this._width, n).endFill();
    }

    this._horizontal_grid_container.addChild(graphics);
  }

  drawVerticalGrid() {
    // draw vertical lines
  }

  resized({width, height}){
    this._width = width;
    this._height = height;
    this._note_width = width / 9.0;

    for(let note_index in this._notes_container.children) {
      let note = this._notes_container.children[note_index];
      note.width = this._note_width;
    }

    this.drawHorizontalGrid();
    this._renderer.resize(width, height);
    this._renderer.render(this._stage);    
  }

  __initPixi__(_view) {
    this._stage = new PIXI.Stage(0x000000);
    this._renderer = new PIXI.WebGLRenderer(this._width, this._height,{
      view: _view
    });
  }


  mapYToTime(y){
    let gridPerSub = grid / sub; // 1拍あたりの分割数
    let msecPerGrid = ( 60.0 / (this._bpm * gridPerSub) ) * 1000.0;
    let grid_height = MEASURE_SIZE / this._grid;
    let currentGrid = ~~(y / grid_height);
    return currentGrid * msecPerGrid;
  }

  mapTimeToY(time) {
    let gridPerSub = this._grid / this._sub;
    let gridPerMsec = (this._bpm * gridPerSub) / (60.0 * 1000.0);
    return time * gridPerMsec * (MEASURE_SIZE / this._grid);
  }
  
}