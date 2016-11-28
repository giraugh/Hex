// INITS THAT ARENT RESET
gamePaused = false;
autoRestart = false;
traceHex = {
    x: -1,
    y: -1,
    colour: 'black'
};
doLogReturns = false;
traceReturns = false;
showConnectionValues = false;
saturateColours = false;

gameDelay = 0;
gameDelayMax = 0;

//Set Default Scripts and check URL For Data
init_scripts()

//Initialize letiables and functions used by game
function game_init() {

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
    setStyle = function(c) {
        let color = c
        dg = function(x) {
            return document.getElementById(x);
        }
        if (dg("title"))
            dg("title").style = "color:" + color + ";";
        if (dg("left-title"))
            dg("left-title").style = "color:" + color + ";";
        if (dg("right-title"))
            dg("right-title").style = "color:" + color + ";";
    }

    setStyle(color);

    //CREATE AND POPULATE GRID (STORES WHO OWNS A HEX)
    grid = create2dArray(gridSize);
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            grid[x][y] = 0;
        }
    }

    //CREATE AND POPULATE ANOTHER GRID (STORES WHETHER A HEX IS CONNECTED)
    cgrid = create3dArray(gridSize);
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
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
