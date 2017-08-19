/**
 * WebPackのエントリーポイント
 */
import Dispatcher from "./dispatcher.js";
import BeatmapEditorStore from "../store/beatmapEditorStore.js";
import NavBarStore from "../store/navBarStore.js";
import DRAW_MODE from "./draw_mode.js";
require('../tags/beatmapEditor.tag');
require('../tags/labelField.tag');
require('../tags/fileField.tag');
require('../tags/selectField.tag');
require('../tags/rangeField.tag');
require('../tags/sidebarTab.tag');
require('../tags/songTab.tag');
require('../tags/previewTab.tag');
require('../tags/navBar.tag');

const beatmapEditor = new BeatmapEditorStore();
const navBar = new NavBarStore();
const dispatcher = new Dispatcher();
let resizedTimer = null;

$(document).ready(function(){
  $('ul.tabs').tabs();
  $('select').material_select();
});

window.addEventListener('resize', () => {
  if(resizedTimer !== false){
    clearTimeout(resizedTimer);
  }
  resizedTimer = setTimeout(() =>  dispatcher.trigger("window_resized", {})
, 200);
});
riot.mount('BeatmapEditor', { store: beatmapEditor, dispatcher: dispatcher });
riot.mount('LabelField');
riot.mount('FileField');
riot.mount('RangeField');
riot.mount('SelectField');
riot.mount('SideBarTab');
riot.mount('SongTab');
riot.mount('PreviewTab');
riot.mount('NavBar', { items: [
  {mode: -1, text:"New"},
  {mode: -2, text:"Open"},
  {mode: -3, text:"Save"},
  {mode: DRAW_MODE.move, text:"Move"},
  {mode: DRAW_MODE.draw, text:"Draw"},
  {mode: DRAW_MODE.delete, text:"Delete"},
  {mode: DRAW_MODE.star, text:"Star"},
  {mode: DRAW_MODE.longnotes, text:"LongNotes"},
  {mode: DRAW_MODE.swing, text:"Swing"}
], store: navBar, dispatcher: dispatcher });
