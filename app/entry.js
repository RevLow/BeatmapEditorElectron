/**
 * WebPackのエントリーポイント
 */
require('../tags/beatmapEditor.tag');
require('../tags/labelField.tag');
require('../tags/fileField.tag');
require('../tags/selectField.tag');
require('../tags/rangeField.tag');
require('../tags/sidebarTab.tag');
require('../tags/songTab.tag');
require('../tags/previewTab.tag');
require('../tags/navBar.tag');

$(document).ready(function(){
  $('ul.tabs').tabs();
  $('select').material_select();
});

riot.mount('BeatmapEditor');
riot.mount('LabelField');
riot.mount('FileField');
riot.mount('RangeField');
riot.mount('SelectField');
riot.mount('SideBarTab');
riot.mount('SongTab');
riot.mount('PreviewTab');
riot.mount('NavBar', { items: [
  {link: "#", text:"New"},
  {link: "#", text:"Open"},
  {link: "#", text:"Save"},
  {link: "#", text:"Draw"},
  {link: "#", text:"Delete"},
  {link: "#", text:"Star"},
  {link: "#", text:"LongNotes"},
  {link: "#", text:"Swing"}
]});
