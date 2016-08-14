function getContents() {
	return [
		document.getElementById("left").value,
		document.getElementById("right").value
	]
}

function load_scripts()
{
	var lcode = getContents()[0];
	var rcode = getContents()[1];
	gotContents(lcode, "left");
	gotContents(rcode, "right");
	var lworked = true;var rworked = true;

	var eventReg = /#\s?events?/i;
	var initReg = /(init|start|setup)\s?(\(.*\))?\s?{/i; //For Replacing init() with init1/2()
	var updateReg = /(update|loop|main)\s?(\(.*\))?\s?{/i; //For Replacing update() with update1/2()
	var initCReg = /(init|start|setup)\s?=\s?\(\)\s?->/i; //For Replacing init() with init1/2()
	var updateCReg = /(update|loop|main)\s?=\s?\(\)\s?->/i; //For Replacing update() with update1/2()
	var propReg = /prop(?:ertie)?s?\s?=?\s?{/i;
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

	//check if events
	doEventsL = false;
	doEventsR = false;
	if (eventReg.test(lcode) && !coffeeReg.test(lcode)) {lcode = lcode.replace(eventReg,"");doEventsL = true;lcode = lcode.replace(initReg,'window.init1$2 = function() {');lcode = lcode.replace(updateReg,'window.update1$2 = function() {');}
	if (eventReg.test(rcode) && !coffeeReg.test(rcode)) {rcode = rcode.replace(eventReg,"");doEventsR = true;rcode = rcode.replace(initReg,'window.init2$2 = function() {');rcode = rcode.replace(updateReg,'window.update2$2 = function() {');}

	//check if coffee events
	if (eventReg.test(lcode) && coffeeReg.test(lcode)) {console.log("EVENTS");lcode = lcode.replace(eventReg,"");doEventsL = true;lcode = lcode.replace(initCReg,'window.init1 = () ->');lcode = lcode.replace(updateCReg,'window.update1 = () ->');}
	if (eventReg.test(rcode) && coffeeReg.test(rcode)) {rcode = rcode.replace(eventReg,"");doEventsR = true;rcode = rcode.replace(initCReg,'window.init2 = () ->');rcode = rcode.replace(updateCReg,'window.update2 = () ->');}

	//check if Mocha
	if (mochaReg.test(lcode)) {lcode = Mocha(lcode);}
	if (mochaReg.test(rcode)) {rcode = Mocha(rcode);}

	//check if Coffee
	if (coffeeReg.test(lcode)) {lcode = lcode.replace(coffeeReg, "");lcode = hexCoffee(lcode);}
	if (coffeeReg.test(rcode)) {rcode = rcode.replace(coffeeReg, "");rcode = hexCoffee(rcode);}

	//check if props
	if (propReg.test(lcode)){lcode = lcode.replace(propReg,"window.props1 = {");}
	if (propReg.test(rcode)){rcode = rcode.replace(propReg,"window.props2 = {");}

	if (mathsReg.test(lcode) || mathsReg.test(rcode)){
		keys = Object.getOwnPropertyNames(Math);
		for (let i = 0;i<keys.length;i++) {
			window[keys[i]] = Math[keys[i]];
		}
	}

	try {
		eval("function lcode_ee(){"+lcode+"};lcode_ee();");
	} catch (e) {
		if (e instanceof SyntaxError) {
			log("P1:SYNTAX:"+e.message);
		}
		log("P1:"+e.message);
		lworked = false;
	}

	try {
		eval("function rcode_ee(){"+rcode+"};rcode_ee();");
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
			player1_turne = Function(lcode);
			if (player1_turne() == null || player1_turne() == undefined){lworked = false;console.log("P1: NO RETURN VAL");}
			else
			{
				if (player1_turne()[0] == null){lworked = false;console.log("P1: NO FIRST RETURN VAL");}
				if (!typeof player1_turne() == 'object'){lworked = false;console.log("P1: INCORRECT RETURN TYPE, MUST BE ARRAY");}
				if (player1_turne()[1] == null){lworked = false;console.log("P1: NO SECOND RETURN VAL");}
			}
		}
	}

	if (!doEventsR) {
		if (rworked) {
			player2_turne = Function(rcode);
			if (player2_turne() == null || player2_turne() == undefined){rworked = false;console.log("P2: NO RETURN VAL");}
			else
			{
				if (player2_turne()[0] == null){rworked = false;console.log("P2: NO FIRST RETURN VAL");}
				if (!typeof player2_turne() == 'object'){rworked = false;console.log("P2: INCORRECT RETURN TYPE, MUST BE ARRAY");}
				if (player2_turne()[1] == null){rworked = false;console.log("P2: NO SECOND RETURN VAL");}
			}
		}
	}

	if (!lworked){window.document.getElementById("left-title").style = "background-color: white;";note("P1: Compiler Error");}else{window.document.getElementById("left-title").style = "background-color: "+game_wbackground();}
	if (!rworked){window.document.getElementById("right-title").style = "background-color: white;";note("P2: Compiler Error");}else{window.document.getElementById("right-title").style = "background-color: "+game_wbackground();}

	if (lworked && customScriptLeft){player1_turn = Function(lcode);}
	if (rworked && customScriptRight){player2_turn = Function(rcode);}
}
