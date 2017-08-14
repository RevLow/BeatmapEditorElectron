<SongTab>
  <div class="card-image">
    <img class="activator" src="https://rawfile.loveliv.es/assets/image/live/live_icon/j_bd_02_01.png">
  </div>
  <div class="card-content">
    <form>
      <SelectField members="{['EASY', 'NORMAL', 'HARD', 'EXPERT', 'MASTER']}">DIFFICULTY</SelectField>
      <SelectField members="{['SMILE', 'PURE', 'COOL']}">TYPE</SelectField>
      <LabelField key="llsif-title">TITLE</LabelField>
      <FileField  key="llsif-bgm" placeholder="BGM"></FileField>
      <FileField  key="llsif-bgv" placeholder="BGV"></FileField>
      <RangeField key="llsif-level" max="12" min="1">LEVEL</RangeField>
    </form>
  </div>
</SongTab>