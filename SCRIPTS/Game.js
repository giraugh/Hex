/* INITS THAT ARENT RESET */
gamePaused = false;
autoRestart = false;
traceHex = {x: -1,y: -1,colour: 'black'};
doLogReturns = false;
traceReturns = false;
showConnectionValues = false;
saturateColours = false;

//Set Default Scripts and check URL For Data
init_scripts()

//Initialize variables and functions used by game
function game_init(game) {

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

//Define sprites used by game
function init_sprites() {
	//DEFINE HEX SPRITE
	sHex = new Image();
	sHex.src = "IMAGES/Hex.png"

	//DEFINE INVERTED HEX SPRITE
	sHexI = new Image();
	sHexI.src = "IMAGES/InvertedHex.png"
}

//Do the supplied turns whilst looking for runtime errors
function game_turns() {

	var success = false; //BOOL - DID THE PLAYER CHOOSE A LEGITIMATE HEX?
	var hex = new Array();

	hex[0] = 0;
	hex[1] = 0;

	//VALIDATE
	validated = true;

	//INIT (if we need to)
	if (attemptCount == 0) {
		try {player1_turn("init");}
		catch (e) {
			let ma = (/([a-zA-Z._$]+) \(<anonymous>:([0-9]+):([0-9]+)\)/g).exec(e.stack)
			note("RUNTIME ERROR " + e + " @" + String(ma[1]).replace("Object.init", "Init") + ":" + String(ma[2]-26) + ":" + String(ma[3]))
		}
		initialized1 = true;
	}

	if (attemptCount == 1) {
		try {player2_turn("init");}
		catch (e) {
			let ma = (/([a-zA-Z._$]+) \(<anonymous>:([0-9]+):([0-9]+)\)/g).exec(e.stack)
			note("RUNTIME ERROR " + e + " @" + String(ma[1]).replace("Object.init", "Init") + ":" + String(ma[2]-26) + ":" + String(ma[3]))
		}
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
				let ma = (/([a-zA-Z._$]+) \(<anonymous>:([0-9]+):([0-9]+)\)/g).exec(e.stack)
				note("RUNTIME ERROR " + e + " @" + String(ma[1]).replace("Object.main","Main") + ":" + String(ma[2]-26) + ":" + String(ma[3]))
			}
		}
		hex= hf();
	}

	if (turn == 1)
	{
		hf = ()=>{
			try {
				return player2_turn("main");
			} catch(e) {
				let ma = (/([a-zA-Z._$]+) \(<anonymous>:([0-9]+):([0-9]+)\)/g).exec(e.stack)
				note("RUNTIME ERROR " + e + " @" + String(ma[1]).replace("Object.main","Main") + ":" + String(ma[2]-26) + ":" + String(ma[3]))
			}
		}
		hex= hf();
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

//Used to check connections on a board
function game_update_connections_ext(board, cboard, auth) {
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
											if(auth){if (board[x][y] != 0){gameStopped = true;}}
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

//Check connections and whether someone has won
function game_update_connections() {
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

//Update Page then perform game step
function game_loop() {

	//Update Page
	page_update()

	//If game hasnt stopped and isnt paused
	if (!gameStopped)
	{
		if (!gamePaused)
		game_step()
	}
}

//Perform game turns and update connections
function game_step() {
	//DO TURNS
	game_turns();

	//UPDATE HEX CONNECTIONS
	game_update_connections();
}

//Draw hex grid
function game_draw_hexs(ctx) {
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

//Main loop - Update game and draw hex's
function game_draw(ctx, game) {
	//Main loop
	game_loop();

	//Draw hexes
	game_draw_hexs(ctx);
}
