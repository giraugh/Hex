//Update props and hotkeys
function page_update() {
  page_properties()
  page_hotkeys()
  page_coffee()
}

//Update whether editors should show coffee syntax
function page_coffee() {
  if (/#coffee/i.test(EditorL.getValue())) {
    update_gui_set_coffee("left", true)
    EditorL.getSession().setMode("ace/mode/coffee")
  } else {
    update_gui_set_coffee("left", false)
    EditorL.getSession().setMode("ace/mode/javascript")
  }
  if (/#coffee/ig.test(EditorR.getValue())) {
    update_gui_set_coffee("right", true)
    EditorR.getSession().setMode("ace/mode/coffee");
  } else {
    update_gui_set_coffee("right", true)
    EditorR.getSession().setMode("ace/mode/javascript");
  }
}

//Update properties
function page_properties() {
  //Update Properties
	if(player1_turn){
		let props1 = player1_turn("props");
		if (props1 != undefined) {
			useProps(props1.name,props1.author,props1.version,props1.description,'left');
		}
	}

	if(player2_turn){
		let props2 = player2_turn("props");
		if (props2 != undefined) {
			useProps(props2.name,props2.author,props2.version,props2.description,'right');
		}
	}
}

//Used by page to control hotkeys
function page_hotkeys() {
	//Restart
	if (keyPressed("r")) game_restart()

	//Play / Pause
	if (keyPressed("p")) game_togglePause()

	//Step
	if (keyPressed("s")) game_step()
}

//Used by page to restart game
function game_restart() {
	console.clear();game_init();
}

//Used by page to toggle game trace state
function game_toggleTraceRets() {
	traceReturns = !traceReturns
	if (traceReturns)
		removeClass(dg("icon-trace").children[0], "inactive")
	else
		addClass(dg("icon-trace").children[0], "inactive")
}

//Used by page to toggle game auto-res state
function game_toggleAutoRes() {
	autoRestart = !autoRestart
	if (autoRestart)
		removeClass(dg("icon-autorestart").children[0], "inactive")
	else
		addClass(dg("icon-autorestart").children[0], "inactive")
}

//Used by page to toggle game paused state
function game_togglePause() {
	gamePaused = !gamePaused
	if (gamePaused)
		dg("icon-pause").children[0].innerHTML = "play_arrow"
	else
		dg("icon-pause").children[0].innerHTML = "pause"
}

//used by page to set coffee
function update_gui_set_coffee(which, set) {
	let editor;
	if (which == "right")
		editor = EditorR
	else
		editor = EditorL
	editor.coffee = set
	document.getElementById("coffee-"+which).innerHTML = editor.coffee ? "To Javascript" : "To Coffee"
}

//used by page to set coffee
function set_coffee(which) {
	//which editor?
	let editor;
	if (which == "right")
		editor = EditorR
	else
		editor = EditorL

	//is it coffee?
	if (!editor.coffee) {
		//update_gui_set_coffee(which, true)
		if (js2coffee) {
			//ensure props stays at top
			editor.setValue(editor.getValue().replace(/properties/g, "let properties"))

			//convert to coffee
			editor.setValue(js2coffee.build(editor.getValue()).code, -1)

			//fix tabs
			editor.setValue(editor.getValue().replace(/  /g, "    "))

			//undo the ensurint thing
			editor.setValue(editor.getValue().replace(/let properties/g, "properties"))
		}
		editor.setValue("#COFFEE\n"+editor.getValue(), -1);
	} else {
		//back to js
		//update_gui_set_coffee(which, false)
		editor.setValue(editor.getValue().replace("#COFFEE\n",""), -1)
		editor.setValue(hexCoffee(editor.getValue()), -1)
	}

}
