function getContents() {
	return [
		document.getElementById("left").value,
		document.getElementById("right").value
	]
}
var longVariable = "anIncrediblyLongNameForAVariableBecauseItIsActuallyASecretParamaterToTheFunctionThatSelectsWhetherOrNotToRunInitOrMainOrReturnProperties";
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

	// Add JS call selector, interface for calling functions within the code
	let callSelector = `
if (` + longVariable + ` == \"init\") 
	return init();
 else if (`+longVariable+` == \"main\")
	return main();
else if (`+longVariable+` == \"props\")
	return properties;`

	lcode += callSelector;
	rcode += callSelector;
	
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

	if (mathsReg.test(lcode) || mathsReg.test(rcode)){
		keys = Object.getOwnPropertyNames(Math);
		for (let i = 0;i<keys.length;i++) {
			window[keys[i]] = Math[keys[i]];
		}
	}

	try {
		eval("function lcode_ee(" + longVariable + "){"+lcode+"};lcode_ee();");
	} catch (e) {
		if (e instanceof SyntaxError) {
			log("P1:SYNTAX:"+e.message);
		}
		log("P1:"+e.message);
		lworked = false;
	}

	try {
		eval("function rcode_ee(" + longVariable + "){"+rcode+"};rcode_ee();");
	} catch (e) {
		if (e instanceof SyntaxError) {
			log("P2:SYNTAX:"+e.message);
		}
		else
		{
			log("P2:"+e.message);
		}
		rworked = false;
	}

	//Check if no returns
	if (!doEventsL) {
		if (lworked) {
			player1_turne = Function(longVariable,lcode);
			if (player1_turne("main") == null || player1_turne("main") == undefined){lworked = false;console.log("P1: NO RETURN VAL");}
			else
			{
				if (player1_turne("main")[0] == null){lworked = false;console.log("P1: NO FIRST RETURN VAL");}
				if (!typeof player1_turne("main") == 'object'){lworked = false;console.log("P1: INCORRECT RETURN TYPE, MUST BE ARRAY");}
				if (player1_turne("main")[1] == null){lworked = false;console.log("P1: NO SECOND RETURN VAL");}
			}
		}
	}

	if (!doEventsR) {
		if (rworked) {
			player2_turne = Function(longVariable,rcode);
			if (player2_turne("main") == null || player2_turne("main") == undefined){rworked = false;console.log("P2: NO RETURN VAL");}
			else
			{
				if (player2_turne("main")[0] == null){rworked = false;console.log("P2: NO FIRST RETURN VAL");}
				if (!typeof player2_turne("main") == 'object'){rworked = false;console.log("P2: INCORRECT RETURN TYPE, MUST BE ARRAY");}
				if (player2_turne("main")[1] == null){rworked = false;console.log("P2: NO SECOND RETURN VAL");}
			}
		}
	}

	if (!lworked){window.document.getElementById("left-title").style = "background-color: white;";note("P1: Compiler Error");}else{window.document.getElementById("left-title").style = "background-color: "+game_wbackground();}
	if (!rworked){window.document.getElementById("right-title").style = "background-color: white;";note("P2: Compiler Error");}else{window.document.getElementById("right-title").style = "background-color: "+game_wbackground();}

	if (lworked && customScriptLeft){window.player1_turn = Function(longVariable, lcode);}
	if (rworked && customScriptRight){window.player2_turn = Function(longVariable, rcode);}
}
