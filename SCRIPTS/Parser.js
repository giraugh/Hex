function getContents() {
	return [
		get_scripts("left"),
		get_scripts("right")
	]
}

let callSelectorVarName = "callSelectionVar";
function load_scripts()
{
	var lcode = getContents()[0];
	var rcode = getContents()[1];
	gotContents(lcode, "left");
	gotContents(rcode, "right");
	var lworked = true;var rworked = true;

	var mochaReg = /#\s?mocha/i;
	var coffeeReg = /#\s?coffee(script)?/i;
	var latteReg = /#\s?(python(script)?|latte(script)?|tippy(toe)?(script)?)/i;
	var mathsReg = /#\s?math(s)?/i;

	//Make references relate to variable STORES
	lcode = lcode.split("~").join("vP1.");
	rcode = rcode.split("~").join("vP2.");

	//We make the latte code into coffee code
	//check if Coffee
	if (latteReg.test(lcode)) {lcode = lcode.replace(latteReg, "");lcode = "#COFFEE\n"+tpt_compile(lcode);}
	if (latteReg.test(rcode)) {rcode = rcode.replace(latteReg, "");rcode = "#COFFEE\n"+tpt_compile(rcode);}

	//check if Mocha
	if (mochaReg.test(lcode)) {lcode = Mocha(lcode);}
	if (mochaReg.test(rcode)) {rcode = Mocha(rcode);}

	//check if Coffee
	if (coffeeReg.test(lcode)) {
		// Remove header
		lcode = lcode.replace(coffeeReg, "");

		// Compile code
		try {
			lcode = hexCoffee(lcode);
		} catch (e) {
			note("COFFEE ERROR: "+e.message);lcode = ""
		}
	}

	if (coffeeReg.test(rcode)) {
		// Remove header
		rcode = rcode.replace(coffeeReg, "");

		try {
			rcode = hexCoffee(rcode);
		} catch (e) {
			note("COFFEE ERROR: "+e.message);rcode = ""
		}
	}

	//Shadower
	let shadower = `
var document,
	turns,
	grid = clone(),
	cgrid = clone3d(),
	turn = window.turn,
	turnCount = window.turnCount,
	attemptCount = window.attemptCount,
	blue = window.blue,
	red = window.red,
	blank = window.blank,
	redSat = window.redSat,
	blueSat = window.blueSat,
	gameStopped = window.gameStopped,
	props1 = window.props1,
	props2 = window.props2,
	gridSize = window.gridSize,
	gridRes = window.gridRes,
	gridPad = window.gridPad,
	gridOff = window.gridOff`

	let defaults = `

let properties = {name: "", author: "",  description: "", version: 0}
function init(){}
function main(){return [-1, -1]}
`

	// Add JS call selector, interface for calling functions within the code
	let callSelector = `

if (` + callSelectorVarName + ` == "init")
	return init.bind(vP1)();
else if (`+callSelectorVarName+` == "main")
	return main.bind(vP1)();
else if (`+callSelectorVarName+` == "props")
	return properties;
`

	lcode += callSelector;
	lcode = shadower + defaults + lcode;
	rcode += callSelector.split("vP1").join("vP2");
	rcode = shadower + defaults + rcode;

	if (mathsReg.test(lcode) || mathsReg.test(rcode)){
		keys = Object.getOwnPropertyNames(Math);
		for (let i = 0;i<keys.length;i++) {
			window[keys[i]] = Math[keys[i]];
		}
	}

	try {player1_turne = Function(callSelectorVarName,lcode).bind({});}
	catch (e) {note("COMPILER ERROR: "+e);lcode = ""}

	try {player2_turne = Function(callSelectorVarName,rcode).bind({});}
	catch (e) {note("COMPILER ERROR: "+e);rcode = ""}

	try {player1_turne()}
	catch(e){note("COMPILER ERROR: "+e);lcode = ""}

	try {player2_turne()}
	catch(e){note("COMPILER ERROR: "+e);rcode = ""}

	if (lcode != ""){window.player1_turn = Function(callSelectorVarName, lcode).bind({});}
	if (rcode != ""){window.player2_turn = Function(callSelectorVarName, rcode).bind({});}
}
