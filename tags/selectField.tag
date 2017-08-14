<SelectField>
  <div class="input-field">
    <select>
      <option each="{ item, i in opts.members }" value="{ i }">
        { item }
      </option>
    </select>
    <label><yield /></label>
  </div>
</SelectField>