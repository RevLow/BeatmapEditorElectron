export default class ScrollContainer {
  set size({width, height}){
    this.width = width;
    this.height = height;
    this.onsizechange(width, height);
  }
  set scrollY(y){
    this.scrollContainer.y = y;
  }
  get scrollY() {
    return this.scrollContainer.y;
  }

  constructor(width, height, fullHeight) {
    this.width = width;
    this.height = height;
    this.fullHeight = fullHeight;
    this.objectContainer = new PIXI.DisplayObjectContainer();
    this.scrollContainer = new PIXI.DisplayObjectContainer();
    this.objectContainer.addChild(this.scrollContainer);
    this.items = [];

    this.mask = new PIXI.Graphics();
    this.mask.beginFill(0xFFFFFF)
             .drawRect(0, 0, width, height)
             .endFill();
    this.objectContainer.addChild(this.mask);
    this.scrollContainer.mask = this.mask;
    this.objectContainer.interactive = true;
    this.objectContainer.mousemove = this.onmousemove.bind(this);
    this.objectContainer.mousedown = this.onmousedown.bind(this);
    this.objectContainer.mouseup = this.onmouseup.bind(this);

    this.itemHeight = 160;
    this.mouseDown = false;
    this.lastPos = null;
    this.lastDiff = null;
    this.scrollTween = null;
    this.maxVel = 0;
  }

  addItem(listObject) {
    this.scrollContainer.addChild(listObject);
    this.items.push(listObject);
  }

  /**
   * 画面サイズの変更処理
   * @param {Number} width 変更後の画面幅
   * @param {Number} height 変更後の画面高さ
   */
  onsizechange(width, height){
    this.mask.clear();
    this.mask.beginFill(0xFFFFFF)
             .drawRect(0,0,width, height)
             .endFill();
    this.items.forEach((item) => {
      item.width = width;
    });
  }


  /**
   * マウス移動のイベントハンドラ
   * 前の位置と今の位置の差分を取り、scrollContainerのy座標を変化させる
   * @param {event} e マウスクリックイベント 
   */
  onmousemove(e){
    let clientY = e.data.originalEvent.clientY;
    if(this.mouseDown){
      this.lastDiff = clientY - this.lastPos.y;
      this.lastPos.y = clientY;

      if(-this.scrollContainer.y < 0){
        this.scrollContainer.y += this.lastDiff / 2;
      }else{
        this.scrollContainer.y += this.lastDiff;
      }
    }
  }

  /**
   * マウスクリック時のイベント
   * 現在の位置を保持し、マウスの押下状態をtrueにする
   * @param {event} e マウスイベント 
   */
  onmousedown(e){
    let clientY = e.data.originalEvent.clientY;
    this.mouseDown = true;
    if(this.scrollTween){
      this.scrollTween.kill();
    }
    this.lastPos = {
      y: clientY
    }
  }

  /**
   * マウスアップイベント
   * 
   * @param {event} e マウスイベント
   */
  onmouseup(e){
    if(this.lastDiff) {
      let goY = this.scrollContainer.y + this.lastDiff * 10;
      let ease = Quad.easeOut;
      let time = Math.abs(this.lastDiff / 150);
      let boundingY =  this.height - this.fullHeight;

      if(goY < boundingY) {
        goY = boundingY;
        ease = Back.easeOut;
        time = .1 + Math.abs(this.lastDiff / 150);
      }
      if(goY > 0) {
        goY = 0;
        ease = Back.easeOut;
        time = .1 + Math.abs(this.lastDiff / 150);
      }

      if(this.scrollContainer.y > 0){
        time = 1 + this.scrollContainer.y / 500;
        ease = Elastic.easeOut;
      }
      if(this.scrollContainer.y < boundingY){
        time = 1 + (this.fullHeight + this.height + this.scrollContainer.y) / 500;
        ease = Elastic.easeOut;
      }

      this.scrollTween = TweenMax.to(this.scrollContainer, time, {
        y: goY,
        ease: ease
      });
    }

    this.mouseDown = false;
    this.lastPos = null;
    this.lastDiff = null;
  }

  hideOffscreenElements() {
    let viewport = new PIXI.Rectangle(0, -this.scrollContainer.y,this.width,this.height);
    
    this.items.filter((item) => item.id != 1).forEach((item) => {
      item.visible = false;
      let vertices = [
        {x: item.x, y: item.y},
        {x: item.x + item.width, y: item.y},
        {x: item.x, y: item.y + item.height},
        {x: item.x + item.width, y: item.y + item.height}
      ]
      vertices = vertices.filter((vertex) => viewport.contains(vertex.x, vertex.y));
      if(vertices.length != 0) {
        item.visible = true;
      }
    });
  }
}

