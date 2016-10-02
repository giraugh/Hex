/* NOTES
	HEX.html by Ewan Breakey

	The goal is to draw a line across/down the screen before your opponent.

	player 1 (RED) goes ACROSS the page
					&
	player 2 (BLUE) goes DOWN the page
*/

/*GAME DEFINITIONS*/
function game_title(){return 'HEX';}
function game_background(){return '#1d1d1d';}
function game_wbackground(){return '#1d1d1d';}
function game_width(){return 1200;}
function game_height(){return 760;}
window.game_scale = 1;

/*SET UP BOXES*/
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

if (document.getElementById("left-editor"))
	set_scripts("left",defaultProgram);
if (document.getElementById("right-editor"))
	set_scripts("right", defaultProgram.replace("Player 1","Player 2"));


//Does the url have any data in it?
if (window.location.href.includes("?")) {
	botData = /bot(1|2)=%22([\s\S]*)%22/
	//%22 is the char code for "
	if (botData.test(window.location.href)) {
		match = window.location.href.match(botData)
		which = match[1]-1
		code = match[2].split("%20").join(" ").split("BR").join("\n").split("%22").join("	").split("QUOTE").join("\"")
		console.log("bot data found:\n"+code)
		set_scripts(which, code)
	}
}


	function get_url(which) {
		code = get_scripts(which)
		code = code.split("\"").join("QUOTE")
		code = code.split("\n").join("BR")
		code = code.split("\t").join("%22")
		code = code.split(" ").join("%20")
		prompt('',window.location.href + "?bot" + (which+1) + "=\"" + code + "\"")
	}

	function set_scripts(which, what) {
		if (which == "right")
			return EditorR.setValue(what, -1);
		else
			return EditorL.setValue(what, -1);
	}

function get_scripts(which) {
	if (which == "right")
		return EditorR.getValue();
	else
		return EditorL.getValue();
}

function set_coffee(which) {
	//which editor?
	let editor;
	if (which == "right")
		editor = EditorR
	else
		editor = EditorL

	//is it coffee?
	if (!editor.coffee) {
		//set to coffee
		editor.coffee = true
		document.getElementById("coffee-"+which).innerHTML = "To Javascript"
		if (js2coffee)
			editor.setValue(js2coffee.build(editor.getValue()).code, -1)
		editor.setValue("#COFFEE\n"+editor.getValue(), -1);
	} else {
		//back to js
		editor.coffee = false
		document.getElementById("coffee-"+which).innerHTML = "To Coffee"
		editor.setValue(editor.getValue().replace("#COFFEE\n",""), -1)
		editor.setValue(hexCoffee(editor.getValue()), -1)
	}

}

/* INITS THAT ARENT RESET */
gamePaused = false;
autoRestart = false;
traceHex = {x: -1,y: -1,colour: 'black'};
doLogReturns = false;
traceReturns = false;
showConnectionValues = false;
saturateColours = false;

/*GAME EVENTS*/
function game_init(game){

	//GRID CONSTANTS
	gridSize = 11;
	gridRes = 64;
	gridPad = 10;
	gridOff = 2;

	//DEBUG VALUES
	customScriptLeft = true;
	customScriptRight = true;

	//COLOUR CONSTANTS
	blank = '#3D3D3D';
	red = '#E52D3D';
	blue = '#655DE2';
	redSat = '#C20F20';
	blueSat = '#463ED6';

	//DYNAMIC
	turn = 0;
	turnCount = 0;
	attemptCount = 0;
	gameStopped = 0;
	willDisplayEnd = '';
	validated = false;
	initialized1 = false;
	initialized2 = false;
	doEventsL = false;
	doEventsR = false;
	props1 = undefined;
	props2 = undefined;
	vP1 = {} //For storing player 1 vars
	vP2 = {} //For storing player 2 vars
	turns = [];

	//SET COLOURS
	color = '#3D3D3D';
	setStyle = function(c){
		let color = c
		dg = function(x){return document.getElementById(x);}
		if (dg("title"))
			dg("title").style = "color:"+color+";";
		if (dg("left-title"))
			dg("left-title").style = "color:"+color+";";
		if (dg("right-title"))
			dg("right-title").style = "color:"+color+";";
	}

	setStyle(color);

	//CREATE AND POPULATE GRID (STORES WHO OWNS A HEX)
	grid = create2dArray(gridSize);
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			grid[x][y] = 0;
		}
	}

	//CREATE AND POPULATE ANOTHER GRID (STORES WHETHER A HEX IS CONNECTED)
	cgrid = create3dArray(gridSize);
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			cgrid[x][y][0] = 0;
			cgrid[x][y][1] = 0;
		}
	}


	//INITIALIZE SPRITES
	init_sprites();

	// Load all scripts
	load_scripts();
}

function init_sprites()
{
	//DEFINE HEX SPRITE
	sHex = new Image();
	sHex.src = "IMAGES/Hex.png"

	//DEFINE INVERTED HEX SPRITE
	sHexI = new Image();
	sHexI.src = "IMAGES/InvertedHex.png"
}

function clear()
{
	//FOR EACH HEX
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			//SET TO BLANK
			grid[x][y] = 0;
		}
	}


}

function game_turns()
{

	var success = false; //BOOL - DID THE PLAYER CHOOSE A LEGITIMATE HEX?
	var hex = new Array();

	hex[0] = 0;
	hex[1] = 0;

	//VALIDATE
	validated = true;

	//INIT (if we need to)
	if (attemptCount == 0) {
		try {player1_turn("init");}
		catch (e) {note("RUNTIME ERROR: "+e)}
		initialized1 = true;
	}

	if (attemptCount == 1) {
		try {player2_turn("init");}
		catch (e) {note("RUNTIME ERROR: "+e)}
		initialized2 = true;
	}


	//WHO'S TURN IS IT?
	if (turn == 0)
	{
		//FUNCTION DECIDES WHICH PEICE
		hf = ()=>{
			try {
				return player1_turn("main");
			} catch(e) {
				note("RUNTIME ERROR: "+e);
			}
		}
		hex= hf();
	}

	if (turn == 1)
	{
		hex = player2_turn("main");
	}

	//UNVALIDATE
	validated = false;

	if (hex == undefined || hex==null || typeof hex != 'object' || hex.length < 2)
	{
		//IMPROPER HEX
		note("RUNTIME ERROR: INVALID RETURN");
	}
	else
	{
		//CONTINUE AS NORMAL

		//LOG RETURN VALUE IF WE SHOULD
		if (doLogReturns){log(turn+": "+hex);}
		if (traceReturns){trace(hex[0], hex[1]);}

		//GET RETURNED VALUES
		var xx = hex[0];
		var yy = hex[1];

		//WAS IT A SKIP?
		if (xx== -3140 && yy== -3140) {
			success = true;
			log("Player " + String(turn+1) + " Skipped");
		}

		//WAS IT LEGIT MOVE?
		if ((hex[0] >= 0 && hex[1] >= 0) && (hex[0] < gridSize && hex[1] < gridSize))
		{
			//IS IT NOT TAKEN?
			if (grid[xx][yy] == 0)
			{
				grid[xx][yy] = turn+1;
				turns.push({player: turn, position: [xx, yy], x: xx, y: yy, count: turnCount});
				success = true;
			}
		}

		//IF PLAYER CLAIMED A HEX
		if (success)
		{
			//SWAP TURNS
			turn = turn == 1 ? 0 : 1;
			turnCount++;
		}
	}
	attemptCount++;
}

function game_update_connections_ext(board,cboard,auth)
{
	//MAKE SURE EDGES ARE SET
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			var check = -1;
			//CHECKING HORIZONTAL OR VERTICAL?
			if (board[x][y] == 1)
			{var check = x;}
			if (board[x][y] == 2)
			{var check = y;}

			//WE HAVE A VALUE TO CHECK
			if (check != -1)
			{
				//OK, CHECK CONNECTED TO EITHER SIDE
				cboard[x][y][0] = (check == 0) ? 1 : cboard[x][y][0];
				cboard[x][y][1] = (check == gridSize - 1) ? 1 : cboard[x][y][1];
			}
		}
	}

	// FOR EACH HEX
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			for (var e=0;e<2;e++) //FOR BOTH EDGES
			{
				if (board[x][y] != 0) // ARE WE COLOURED?
				{
					if (cboard[x][y][e]) // ARE WE CONNECTED TO THAT EDGE
					{
						// FOR ALL HEX'S IN A GRID AROUND US
						for (var i=-1;i<2;i++)
						{
							for (var j=-1;j<2;j++)
							{
								if ((x+i >= 0 && x+i < gridSize) && (y+j >= 0 && y+j < gridSize) && (i != j)) // ARE WE INSIDE GRID AND NOT A CORNER OR CENTER?
								{
									if (board[x+i][y+j] == board[x][y] && cboard[x+i][y+j][e] != 1) // IS OUR NEIGHBOUR OUR COLOUR AND ARE THEY NOT ALREADY SET?
									{
										// SET VALUE!
										cboard[x+i][y+j][e] = 1;

										if (cboard[x+i][y+j][+(!e)] && !gameStopped)
										{
											if(auth){if (board[x][y] != 0){gameStopped = true;log("STOPPED GAME W/ VAL: " + board[x][y]);}}
											return board[x][y];
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return 0;
}

function game_update_connections()
{
	var win = game_update_connections_ext(grid,cgrid,true);
	var col = blank;
	if (win == 1)
	{
		//PLAYER 1 WON
		log("RED WON!");
		noteRed("Red Won!")
		increaseWins(0)
		col = red;
	}
	if (win == 2)
	{
		//PLAYER 2 WON
		log("BLUE WON!");
		noteBlue("Blue Won!")
		increaseWins(1)
		col = blue;
	}
	if (win != 0){
		setStyle(col);
		if (autoRestart) {
			game_restart()
		}
	}
}

function game_loop()
{

	//UPDATE PROPERTIES
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

	//IF SOMEONE HASN'T ALREADY WON
	if (!gameStopped)
	{
		if (!gamePaused)
		game_step()
	}
	//RESTART GAME IF USER PRESSES R
	if (keyPressed("r")){game_restart();}
}

function game_togglePause() {
	gamePaused = !gamePaused
	if (gamePaused)
		dg("icon-pause").children[0].innerHTML = "play_arrow"
	else
		dg("icon-pause").children[0].innerHTML = "pause"
}

function game_toggleAutoRes() {
	autoRestart = !autoRestart
	if (autoRestart)
		removeClass(dg("icon-autorestart").children[0], "inactive")
	else
		addClass(dg("icon-autorestart").children[0], "inactive")
}

function game_toggleTraceRets() {
	traceReturns = !traceReturns
	if (traceReturns)
		removeClass(dg("icon-trace").children[0], "inactive")
	else
		addClass(dg("icon-trace").children[0], "inactive")
}

function game_step() {
	//DO TURNS
	game_turns();

	//UPDATE HEX CONNECTIONS
	game_update_connections();
}

function game_restart() {
	console.clear();game_init();
}

function game_draw_hexs(ctx)
{
	//FOR EACH GRID SPOT
	for (var x=0;x<gridSize;x++)
	{
		for (var y=0;y<gridSize;y++)
		{
			//WHERE IS HEX? CONSIDER PADDING AND OFFSET PLUS SKEWING TO MAKE A RHOMBUS
			var xx = (gridOff + (x*(gridRes+gridPad)))+y*(gridRes/2);
			var yy = (gridOff + (y*(gridRes+(1/2*gridPad))));
			var colour = blank;

			//WHICH COLOUR?
			colour = grid[x][y]==0 ? blank : grid[x][y]==1 ? red : blue;
			//SATURATE?
			if (saturateColours)
			{
				if (colour == red){colour = cgrid[x][y][0]+cgrid[x][y][1] > 0 ? redSat : colour;}
				if (colour == blue){colour = cgrid[x][y][0]+cgrid[x][y][1] > 0 ? blueSat : colour;}
			}

			//ARE WE THE TRACE HEX?
			if (traceHex.x == x && traceHex.y == y && !gameStopped)
			{
				colour = traceHex.colour;
			}

			//DRAW HEX
			ctx.drawImage(sHex,xx,yy);

			ctx.globalCompositeOperation = "darken";
			//COLOUR HEX
			ctx.fillStyle=colour;
			ctx.fillRect(xx,yy,gridRes,gridRes);
			ctx.globalCompositeOperation = "source-over";


			//DRAW CONNECTION DEBUG TEST?
			if (showConnectionValues)
			{
				ctx.fillStyle='black';
				ctx.fillText(cgrid[x][y][0].toString()+cgrid[x][y][1].toString(),xx+(gridRes/2),yy+(gridRes/2));
			}
		}
	}
}

function game_draw(ctx,game){
	//are editors supposed to be in coffee mode?
	update_coffee()

	//main loop
	game_loop();

	//draw hexes
	game_draw_hexs(ctx);

	//DISPLAY END MESSAGE IF NECESSARY
	if (willDisplayEnd != "")
	{
		alert(willDisplayEnd);
		willDisplayEnd = "";
	}
}
