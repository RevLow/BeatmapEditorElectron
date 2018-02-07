<BeatmapEditor>
  <canvas id="llsif-editor-view" onclick="{ this.canvasClick }"></canvas>
  <script>
    import DRAW_MODE from "../app/draw_mode.js";
    /**
     * データを描画用に変換する
     */
    this.store = opts.store;
    this.dispatcher = opts.dispatcher;
    this.dispatcher.addStore(this.store);

    this.on("mount", () => {
      let canvas = document.getElementById("llsif-editor-view");
      let width = $("beatmapeditor").width();
      let height = $("beatmapeditor").height();
      this.store.init({
        width: width,
        height: height,
        view: canvas
      });
    });

    this.store.on("canvas_click", (action) => {
      console.log("X:["+action.position.x+"], Y:["+action.position.y+"]");
      switch(this.store.mode){
        case(DRAW_MODE.move):
          console.log("clicked mode:[MOVE]");
          break;
        case(DRAW_MODE.draw):{
          this.store.addNotes(action.position.x, action.position.y);
          break;
        }
        case(DRAW_MODE.delete):
          break;
        case(DRAW_MODE.star):
          break;
        case(DRAW_MODE.longnotes):
          break;
        case(DRAW_MODE.swing):
          break;
        default:
          break;
      }
    });

    this.store.on("change_mode", (action) => {
      this.store.mode = action.mode;
    })

    this.store.on("window_resized", (action) => {
      let width = $("beatmapeditor").width();
      let height = $("beatmapeditor").height();
      this.store.resized({width: width, height: height});
    });

    this.canvasClick = (e) => {
      let position = {
        x: e.offsetX,
        y: e.offsetY
      };
      const clickAction = {
        type: "click",
        position: position
      };
      this.dispatcher.trigger("canvas_click", clickAction);
    };
  </script>
</BeatmapEditor>
