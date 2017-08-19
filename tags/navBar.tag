<NavBar>
  <nav>
    <div class="{opts.color} nav-wrapper { opts.depth }">
      <ul id="nav-mobile" class="left">
        <li each="{item in opts.items}" >
          <a href="#" onclick={clickItem.bind(this, item.mode)}>{ item.text }</a>
        </li>
      </ul>
    </div>
  </nav>
  <script>
    this.store = opts.store;
    this.dispatcher = opts.dispatcher;
    this.dispatcher.addStore(this.store);
    clickItem (mode, e) {
      this.dispatcher.trigger("change_mode", {mode: mode});
    };

    this.store.on("change_mode", (action) => {
      this.store.active = action.mode;
    });
  </script>
</NavBar>