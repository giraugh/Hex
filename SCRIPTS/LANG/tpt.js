window.matches = [
  "function", {
    match: /def\s(.+)\((.*)\)\s?:\s?/g,
    replace: "window.$1 = ($2)->\n"
  }, "condition", {
    match: /if\s(.+):/g,
    replace: "if ($1)"
  }, "remove var and let", {
    match: /let|const|var/,
    replace: ""
  }, "range three args", {
    match: /(?:x_)?range\(([0-9]+),\s?([0-9]+),\s?([0-9]+)\)/,
    replace: "[$1..$2] by $3"
  }, "range two args", {
    match: /(?:x_)?range\(([0-9]+),\s?([0-9]+)\)/,
    replace: "[$1..$2]"
  }, "range one arg", {
    match: /(?:x_)?range\(([0-9]+)\)/,
    replace: "[0..$2]"
  }
];


window.print = function(x) {
  if (x == null) {
    x = "";
  }
  return console.log(x);
};



window.tpt_compile = function(string, options) {
  var convertTabs, i, j, len, match, ref, reg, tabArray, tabVal, updateTabs;
  if (string == null) {
    string = "return 0";
  }
  if (options == null) {
    options = {};
  }
  tabArray = [];
  convertTabs = options.convertTabs || true;
  tabVal = options.tabVal || 3;
  if (convertTabs) {
    string = string.replace(/\n/g, "<NL>");
    string = string.replace(/\s{3}/g, "\t");
    string = string.replace(/<NL>/g, "\n");
  }
  updateTabs = function() {
    var i, j, lines, ref, results;
    results = [];
    for (i = j = 0, ref = (lines = string.split("\n")).length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      results.push(tabArray[i] = (lines[i].match(/\t/g) || []).length);
    }
    return results;
  };
  ref = window.matches;
  for (j = 0, len = ref.length; j < len; j++) {
    match = ref[j];
    string = string.replace(match.match, match.replace);
  }
  string += "\n".repeat((string.match(/\{/g) || []).length);
  reg = /{\n((?:\t.*\n?)+)/;
  i = 32;
  while (string.match(reg && i > 0)) {
    string = string.replace(reg, "{\n$1\n}");
    i--;
  }
  return string;
};
