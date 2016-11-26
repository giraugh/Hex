//Do the supplied turns whilst looking for runtime errors
function game_turns() {

    let success = false; //BOOL - DID THE PLAYER CHOOSE A LEGITIMATE HEX?
    let hex = new Array();

    hex[0] = 0;
    hex[1] = 0;

    //VALIDATE
    validated = true;

    //INIT (if we need to)
    if (attemptCount == 0) {
        try {
            player1_turn("init");
        } catch (e) {
            let ma = (/([a-zA-Z._$]+) \(<anonymous>:([0-9]+):([0-9]+)\)/g).exec(e.stack)
            note("RUNTIME ERROR " + e + " @" + String(ma[1]).replace("Object.init", "Init") + ":" + String(ma[2] - 26) + ":" + String(ma[3]))
        }
        initialized1 = true;
    }

    if (attemptCount == 1) {
        try {
            player2_turn("init");
        } catch (e) {
            let ma = (/([a-zA-Z._$]+) \(<anonymous>:([0-9]+):([0-9]+)\)/g).exec(e.stack)
            note("RUNTIME ERROR " + e + " @" + String(ma[1]).replace("Object.init", "Init") + ":" + String(ma[2] - 26) + ":" + String(ma[3]))
        }
        initialized2 = true;
    }


    //WHO'S TURN IS IT?
    if (turn == 0) {
        //FUNCTION DECIDES WHICH PEICE
        hf = () => {
            try {
                return player1_turn("main");
            } catch (e) {
                let ma = (/([a-zA-Z._$]+) \(<anonymous>:([0-9]+):([0-9]+)\)/g).exec(e.stack)
                note("RUNTIME ERROR " + e + " @" + String(ma[1]).replace("Object.main", "Main") + ":" + String(ma[2] - 26) + ":" + String(ma[3]))
            }
        }
        hex = hf();
    }

    if (turn == 1) {
        hf = () => {
            try {
                return player2_turn("main");
            } catch (e) {
                let ma = (/([a-zA-Z._$]+) \(<anonymous>:([0-9]+):([0-9]+)\)/g).exec(e.stack)
                note("RUNTIME ERROR " + e + " @" + String(ma[1]).replace("Object.main", "Main") + ":" + String(ma[2] - 26) + ":" + String(ma[3]))
            }
        }
        hex = hf();
    }

    //UNVALIDATE
    validated = false;

    if (hex == undefined || hex == null || typeof hex != 'object' || hex.length < 2) {
        //IMPROPER HEX
        note("RUNTIME ERROR: INVALID RETURN");
    } else {
        //CONTINUE AS NORMAL

        //LOG RETURN VALUE IF WE SHOULD
        if (doLogReturns) {
            log(turn + ": " + hex);
        }
        if (traceReturns) {
            trace(hex[0], hex[1]);
        }

        //GET RETURNED VALUES
        let xx = hex[0];
        let yy = hex[1];

        //WAS IT A SKIP?
        if (xx == -3140 && yy == -3140) {
            success = true;
            log("Player " + String(turn + 1) + " Skipped");
        }

        //WAS IT LEGIT MOVE?
        if ((hex[0] >= 0 && hex[1] >= 0) && (hex[0] < gridSize && hex[1] < gridSize)) {
            //IS IT NOT TAKEN?
            if (grid[xx][yy] == 0) {
                grid[xx][yy] = turn + 1;
                turns.push({
                    player: turn,
                    position: [xx, yy],
                    x: xx,
                    y: yy,
                    count: turnCount
                });
                success = true;
            }
        }

        //IF PLAYER CLAIMED A HEX
        if (success) {
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
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            let check = -1;
            //CHECKING HORIZONTAL OR VERTICAL?
            if (board[x][y] == 1) {
                let check = x;
            }
            if (board[x][y] == 2) {
                let check = y;
            }

            //WE HAVE A VALUE TO CHECK
            if (check != -1) {
                //OK, CHECK CONNECTED TO EITHER SIDE
                cboard[x][y][0] = (check == 0) ? 1 : cboard[x][y][0];
                cboard[x][y][1] = (check == gridSize - 1) ? 1 : cboard[x][y][1];
            }
        }
    }

    // FOR EACH HEX
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let e = 0; e < 2; e++) //FOR BOTH EDGES
            {
                if (board[x][y] != 0) // ARE WE COLOURED?
                {
                    if (cboard[x][y][e]) // ARE WE CONNECTED TO THAT EDGE
                    {
                        // FOR ALL HEX'S IN A GRID AROUND US
                        for (let i = -1; i < 2; i++) {
                            for (let j = -1; j < 2; j++) {
                                if ((x + i >= 0 && x + i < gridSize) && (y + j >= 0 && y + j < gridSize) && (i != j)) // ARE WE INSIDE GRID AND NOT A CORNER OR CENTER?
                                {
                                    if (board[x + i][y + j] == board[x][y] && cboard[x + i][y + j][e] != 1) // IS OUR NEIGHBOUR OUR COLOUR AND ARE THEY NOT ALREADY SET?
                                    {
                                        // SET VALUE!
                                        cboard[x + i][y + j][e] = 1;

                                        if (cboard[x + i][y + j][+(!e)] && !gameStopped) {
                                            if (auth) {
                                                if (board[x][y] != 0) {
                                                    gameStopped = true;
                                                }
                                            }
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
    let win = game_update_connections_ext(grid, cgrid, true);
    let col = blank;
    if (win == 1) {
        //PLAYER 1 WON
        log("RED WON!");
        noteRed("Red Won!")
        increaseWins(0)
        col = red;
    }
    if (win == 2) {
        //PLAYER 2 WON
        log("BLUE WON!");
        noteBlue("Blue Won!")
        increaseWins(1)
        col = blue;
    }
    if (win != 0) {
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
    if (!gameStopped) {
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
