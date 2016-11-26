defaultProgram =
`properties = {
	name: "Player 1",
	author: "Me",
	description: "New Bot, its very cool.",
	version: 1.0
}

function init (){

}

function main (){
	let x = rndg()
	let y = rndg()
	return hex(x, y)
}`;

function init_scripts() {
	if (document.getElementById("left-editor"))
		set_scripts("left", defaultProgram);
	if (document.getElementById("right-editor"))
		set_scripts("right", defaultProgram.replace("Player 1","Player 2"));


	//Does the url have any data in it?
	if (window.location.href.includes("?")) {
		botData = /bot(1|2)=([\s\S]*)/
		//%22 is the char code for "
		if (botData.test(window.location.href)) {
			match = window.location.href.match(botData)
			which = match[1]-1
			code = URIdecode(match[2])
			set_scripts(which == 0 ? "left" : "right", code)
		}
	}
}

function get_scripts(which) {
	if (which == "right")
		return EditorR.getValue();
	else
		return EditorL.getValue();
}

function get_url(which) {
	loc = window.location.href.match(/([^?]*)/g)[0]
	code = get_scripts(which)
	code = URIencode(code)
	return loc + "?bot" + (which+1) + "=" + code
}

function show_url(which) {
	prompt("", get_url(which))
}

function copy_url(which) {
	return copyTextToClipboard(get_url(which))
}

function set_scripts(which, what) {
		if (which == "right")
			return EditorR.setValue(what, -1);
		else
			return EditorL.setValue(what, -1);
}
