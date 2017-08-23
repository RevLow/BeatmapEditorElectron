<SideBarTab>
  <div class="card-tabs" style="margin-top: 1vh">
    <ul class="tabs tabs-fixed-width">
      <li class="tab"><a class="active" href="#tab-1">{ opts.tab1 }</a></li>
      <li class="tab"><a href="#tab-2">{ opts.tab2 }</a></li>
    </ul>
  </div>
  <div class="card-content"  style="height: 82vh; overflow: scroll">
    <yield />
  </div>
</SideBarTab>