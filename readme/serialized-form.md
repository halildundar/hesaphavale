<form id="my-profile">
  <!-- simple attribute -->
  <input type="text" name="fullName"              value="Mario Izquierdo" />
  <!-- nested attributes -->
  <input type="text" name="address[city]"         value="San Francisco" />
  <input type="text" name="address[state][name]"  value="California" />
  <input type="text" name="address[state][abbr]"  value="CA" />
  <!-- array -->
  <input type="text" name="jobbies[]"             value="code" />
  <input type="text" name="jobbies[]"             value="climbing" />
  <!-- nested arrays, textareas, checkboxes ... -->
  <textarea              name="projects[0][name]">serializeJSON</textarea>
  <textarea              name="projects[0][language]">javascript</textarea>
  <input type="hidden"   name="projects[0][popular]" value="0" />
  <input type="checkbox" name="projects[0][popular]" value="1" checked />
  <textarea              name="projects[1][name]">tinytest.js</textarea>
  <textarea              name="projects[1][language]">javascript</textarea>
  <input type="hidden"   name="projects[1][popular]" value="0" />
  <input type="checkbox" name="projects[1][popular]" value="1"/>
  <!-- select -->
  <select name="selectOne">
    <option value="paper">Paper</option>
    <option value="rock" selected>Rock</option>
    <option value="scissors">Scissors</option>
  </select>
  <!-- select multiple options, just name it as an array[] -->
  <select multiple name="selectMultiple[]">
    <option value="red"  selected>Red</option>
    <option value="blue" selected>Blue</option>
    <option value="yellow">Yellow</option>
	</select>
</form>


$('#my-profile').serializeJSON();
// returns =>
{
  fullName: "Mario Izquierdo",
  address: {
    city: "San Francisco",
    state: {
      name: "California",
      abbr: "CA"
    }
  },
  jobbies: ["code", "climbing"],
  projects: {
    '0': { name: "serializeJSON", language: "javascript", popular: "1" },
    '1': { name: "tinytest.js",   language: "javascript", popular: "0" }
  },
  selectOne: "rock",
  selectMultiple: ["red", "blue"]
}

jqform-serialize.js dosyasını main dosyasına import etmen yeterli
