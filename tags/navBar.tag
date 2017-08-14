<NavBar>
  <nav>
    <div class="{opts.color} nav-wrapper { opts.depth }">
      <ul id="nav-mobile" class="left">
        <li each="{item in opts.items}" >
          <a href="{ item.link }">{ item.text }</a>
        </li>
      </ul>
    </div>
  </nav>
</NavBar>