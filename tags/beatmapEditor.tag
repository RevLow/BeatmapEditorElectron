<BeatmapEditor>
  <canvas id="llsif-editor-view"></canvas>
  <script>
    var width = 1600;
    var height = 5098;
    var stage = null;
    var render = null;
    var textobj = null;

    this.on("mount", function() {
      // ステージ
      // 0x000000は背景色 16進数000000
      stage = new PIXI.Stage(0xFF6666);
      // レンダラー
      render = PIXI.autoDetectRenderer(width, height, {
        view: document.getElementById("llsif-editor-view")
      });

      var word = "Hello World";
      var style = {
        font: "bold 60pt Arial",
        fill: "white"
      }
      textobj = new PIXI.Text(word, style);
      textobj.position.x = 60;
      textobj.position.y = height / 2;

      stage.addChild(textobj);
      requestAnimationFrame(animate);
    });

    function animate() {
      requestAnimationFrame(animate);
      textobj.rotation += 0.01;
      render.render(stage);
    }
  </script>
</BeatmapEditor>
