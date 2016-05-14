function load_scripts()
{
	gotContents(document.getElementById("left").value,"left");
	gotContents(document.getElementById("right").value,"right");
	var lcode = document.getElementById("left").value;
	var rcode = document.getElementById("right").value;
	var lworked = true;var rworked = true;

	//check if Mocha
	var mochaReg = /#\s?mocha/i;
	if (mochaReg.test(lcode)) {lcode = Mocha(lcode);}
	if (mochaReg.test(rcode)) {rcode = Mocha(rcode);}

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

	if (lworked){
		player1_turne = Function(lcode);
		if (player1_turne() == null || player1_turne() == undefined){lworked = false;console.log("P1: NO RETURN VAL");}
		else
		{
			if (player1_turne()[0] == null){lworked = false;console.log("P1: NO FIRST RETURN VAL");}
			if (!typeof player1_turne() == 'object'){lworked = false;console.log("P1: INCORRECT RETURN TYPE, MUST BE ARRAY");}
			if (player1_turne()[1] == null){lworked = false;console.log("P1: NO SECOND RETURN VAL");}
		}
	}

	if (rworked){
		player2_turne = Function(rcode);
		if (player2_turne() == null || player2_turne() == undefined){rworked = false;console.log("P2: NO RETURN VAL");}
		else
		{
			if (player2_turne()[0] == null){rworked = false;console.log("P2: NO FIRST RETURN VAL");}
			if (!typeof player2_turne() == 'object'){rworked = false;console.log("P2: INCORRECT RETURN TYPE, MUST BE ARRAY");}
			if (player2_turne()[1] == null){rworked = false;console.log("P2: NO SECOND RETURN VAL");}
		}
	}

	if (!lworked){window.document.getElementById("left-title").style = "background-color: white;";}else{window.document.getElementById("left-title").style = "background-color: black;";}
	if (!rworked){window.document.getElementById("right-title").style = "background-color: white;";}else{window.document.getElementById("right-title").style = "background-color: black;";}

	if (lworked && customScriptLeft){player1_turn = Function(lcode);}
	if (rworked && customScriptRight){player2_turn = Function(rcode);}
}
