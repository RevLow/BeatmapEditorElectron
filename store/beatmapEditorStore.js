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
    this._maxTime = 500000;
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
    let maxHeight = this.mapTimeToY(this._maxTime);
    this._scrollContainer = new ScrollContainer(width, height, maxHeight);
    let maxIndex = Math.floor(maxHeight / MEASURE_SIZE) - 1;
    for(let index = maxIndex; index >= 0; index--){
      let paddingIndex = ("000"+index).slice(-4);
      let background = this.createMeasureBackground("#"+paddingIndex);
      background.y = (maxIndex - index) * MEASURE_SIZE;
      background.id = 0;
      this._scrollContainer.addItem(background);
    }
    let horizontalGrid = this.createHorizontalGrid();
    horizontalGrid.id = 1;
    this._scrollContainer.addItem(horizontalGrid);
    this._stage.addChild(this._scrollContainer.objectContainer);
    this._scrollContainer.scrollY = this._height - maxHeight;
    this.tick();

    this.notesContainer = new PIXI.DisplayObjectContainer();
    this.notesContainer.id = 1;
    this._scrollContainer.addItem(this.notesContainer);
  }

  tick() {
    this._scrollContainer.hideOffscreenElements();
    this._renderer.render(this._stage);
    requestAnimationFrame(this.tick.bind(this));
  }

  addNotes(x, y) {
    let offsetX = x;
    let offsetY = y - this._scrollContainer.scrollY;
    let fixed_x = (~~(offsetX / this._note_width)) * this._note_width;
    let fixed_y = (~~(offsetY / this._note_height)) * this._note_height;
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x00FF00)
            .drawRect(0, 0, this._note_width, this._note_height)
            .endFill();
    graphics.x = fixed_x;
    graphics.y = fixed_y;
    this.notesContainer.addChild(graphics);
  }

  createMeasureBackground(label){
    let container = new PIXI.DisplayObjectContainer();
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFFFF * Math.random())
            .drawRect(0,0, this._width, MEASURE_SIZE)
            .endFill();
    let text = new PIXI.Text(label);

    container.addChild(graphics);
    container.addChild(text);
    return container;
  }

  createHorizontalGrid() {
    let container = new PIXI.DisplayObjectContainer();
    let graphics = new PIXI.Graphics();
    // draw horizontal lines
    let sub_height = MEASURE_SIZE / this._sub;
    let grid_height = MEASURE_SIZE / this._grid;
    let height = this.mapTimeToY(this._maxTime);
    for(let n = 0;n <= height;n+=grid_height){
      if(n % sub_height == 0) continue;
      graphics.lineStyle(2, 0xffffff).moveTo(0, n).lineTo(this._width, n).endFill();      
    }

    for(let n = 0;n <= height;n+=sub_height){
      graphics.lineStyle(4, 0xffffff).moveTo(0, n).lineTo(this._width, n).endFill();
    }

    container.addChild(graphics);
    return container;
  }

  drawVerticalGrid() {
    // draw vertical lines
  }

  resized({width, height}){
    this._width = width;
    this._height = height;
    // this._note_width = width / 9.0;
    this._scrollContainer.size = {width: this._width, height: this._height};
    this._renderer.resize(this._width, this._height);
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