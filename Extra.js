
/* UTILITY FUNCTIONS */

//USED TO CREATE 2D ARRAY
function create2dArray(x) {
  var arr = new Array;
  for (var i=0;i<x;i++) {
     arr[i] = new Array;
  }
  
  return arr;
}

//USED TO CREATE 3D ARRAY
function create3dArray(x) {
  var arr = new Array;
  for (var i=0;i<x;i++) {
     arr[i] = create2dArray(x);
  }
  return arr;
}

//CLAMP A VALUE BETWEEN MIN AND MAX
function clamp(a,min,max)
{return Math.min(Math.max(a,min),max);}

function rnd(x){return Math.round(Math.random()*(x));}

function round(x){return Math.round(x);}

/* HELPER DEFINITIONS */
player1 = 1;
player2 = 2;

/* HELPER FUNCTIONS */

//RETURNS WHETHER THIS IS THE GAME RUNNING IT OR THE SYNTAX CHECKER
function valid(){return validated};

//RETURNS HEX AS ARRAY
function hex(x,y,verbose)
{
	if (verbose == undefined || verbose==null){verbose = true;}
	var ret = new Array();
	ret[0] = x;
	ret[1] = y;
	if (!verbose) {
		if (x >= 0 && x < gridSize && y >= 0 && y < gridSize)
		{ret[2] = cgrid[x][y];}else{ret[2] = new Array;ret[2][0] = 0;ret[2][1] = 0;}
		if (x >= 0 && x < gridSize && y >= 0 && y < gridSize)
		{ret[3] = grid[x][y];}else{ret[3] = 0;}
	}
	return ret;
}

//GET CANVAS
function canvas()
{
	return document.getElementById("canvas");
}

//USE THIS TO HIGHLIGHT A HEX
function trace(x,y,colour)
{
	traceHex.x = x;
	traceHex.y = y;
	traceHex.colour = colour;
}

//GET ELEMENT OFFSET
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
var x = getOffset( document.getElementById('yourElId') ).left; 

//GET HEX PROPERTY (OUTDATED)
function get(hex,what)
{
	if (what == "value")
	{return hex[3];}

	if (what == "colour")
	{return hex[3] == 0 ? blank : hex[3] == 1 ? red : blue;}
}

//GETS HEX'S VALUE
function value(x,y) {
	return hex(x,y)[3];
}

//GETS HEX'S COLOUR
function colour(x,y) {
	return hex(x,y)[3] == 0 ? blank : hex(x,y)[3] == 1 ? red : blue;
}

//GETS WHETHER HEX IS EMPTY
function empty(x,y) {
	return grid[x][y] == 0;
}

//RETURNS SPECIAL SKIP VALUE
function skip() {
	var ret = [];
	ret[0] = -3140;
	ret[1] = -3140;
	return ret;
}

//GET COPY OF GRID
function clone()
{
	var clone = create2dArray(gridSize);
	for (var i=0;i<gridSize;i++)
	{
		for (var j=0;j<gridSize;j++)
		{
			clone[i][j] = grid[i][j];
		}		
	}
	return clone;
}

function clone3d()
{
	var clone = create3dArray(gridSize,2);
	for (var i=0;i<gridSize;i++)
	{
		for (var j=0;j<gridSize;j++)
		{
			for (var b=0;b<2;b++)
			{
				clone[i][j][b] = cgrid[i][j][b];
			}	
		}		
	}
	return clone;
}

function neighbours_ext(x1,y1,colour,board)
{
	if (colour == red || colour == "red" || colour == "1"){colour = 1;}
	if (colour == blue || colour == "blue" || colour == "2"){colour = 2;}
	if (colour == blank || colour == "blank" || colour == "grey" || colour == "white"){colour = 0;}
	if (colour == "same"){colour = board[x1][y1];}
	if (colour == "other" || colour == "different" || colour == "opposite"){colour = board[x1][y1] == 1 ? 2 : 1;}
	
	var count = 0;
	
	// FOR ALL HEX'S IN A GRID AROUND HEX 1
	for (var i=-1;i<2;i++)
	{
		for (var j=-1;j<2;j++)
		{
			if ((x1+i >= 0 && x1+i < gridSize) && (y1+j >= 0 && y1+j < gridSize) && (i != j)) // ARE WE INSIDE GRID AND NOT A CORNER OR CENTER?
			{
				if (board[x1+i][y1+j] == colour)
				{
					count ++;
				}
			}
		}
	}
	
	return count;
}

//RETURNS NUMBER OF NEIGHBOURS OF COLOUR
function neighbours(x1,y1,colour)
{
	return neighbours_ext(x1,y1,colour,grid);
}

//RETURNS WHETHER TWO HEX'S ARE NEIGHBOURS
function connected(x1,y1,x2,y2)
{
	// FOR ALL HEX'S IN A GRID AROUND HEX 1
	for (var i=-1;i<2;i++)
	{
		for (var j=-1;j<2;j++)
		{
			if ((x1+i >= 0 && x1+i < gridSize) && (y1+j >= 0 && y1+j < gridSize) && (i != j)) // ARE WE INSIDE GRID AND NOT A CORNER OR CENTER?
			{
				if (x1+i == x2 && y1+j == y2)
				{
					return true;
				}
			}
		}
	}
	
	return false;
}

//RETURNS WHETHER A HEX IS CONNECTED TO A CERTAIN EDGE INDIRECTLY
function isEdgeConnected(x,y,edge)
{
	if (edge == "left" || edge == "top"){edge = 0;}
	if (edge == "right" || edge == "bottom"){edge = 1;}
	return cgrid[x][y][edge];
}