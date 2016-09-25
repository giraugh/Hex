function getContents() {
	return [
		get_scripts("left"),
		get_scripts("right")
	]
}
var longVariable = "aNotSoLongNameThatNooneWillGuess";
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
		lcode = hexCoffee(lcode);
	}

	if (coffeeReg.test(rcode)) {
		// Remove header
		rcode = rcode.replace(coffeeReg, "");

		// Compile code
		rcode = hexCoffee(rcode);
	}

	// Add JS call selector, interface for calling functions within the code
	let callSelector = `
if (` + longVariable + ` == "init")
	return init.bind(vP1)();
 else if (`+longVariable+` == "main")
	return main.bind(vP1)();
else if (`+longVariable+` == "props")
	return properties;`

	lcode += callSelector;
	rcode += callSelector;

	if (mathsReg.test(lcode) || mathsReg.test(rcode)){
		keys = Object.getOwnPropertyNames(Math);
		for (let i = 0;i<keys.length;i++) {
			window[keys[i]] = Math[keys[i]];
		}
	}

	try {player1_turne = Function(longVariable,lcode);}
	catch (e) {note("COMPILER ERROR: "+e);lcode = ""}

	try {player2_turne = Function(longVariable,rcode);}
	catch (e) {note("COMPILER ERROR: "+e);rcode = ""}

	try {player1_turne()}
	catch(e){note("COMPILER ERROR: "+e);lcode = ""}

	try {player2_turne()}
	catch(e){note("COMPILER ERROR: "+e);rcode = ""}

	if (lcode != ""){window.player1_turn = Function(longVariable, lcode);}
	if (rcode != ""){window.player2_turn = Function(longVariable, rcode);}
}
