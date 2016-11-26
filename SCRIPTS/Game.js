//Draw Hex Grid
function game_draw_hexs(ctx) {
    //FOR EACH GRID SPOT
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            //WHERE IS HEX? CONSIDER PADDING AND OFFSET PLUS SKEWING TO MAKE A RHOMBUS
            let xx = (gridOff + (x * (gridRes + gridPad))) + y * (gridRes / 2);
            let yy = (gridOff + (y * (gridRes + (1 / 2 * gridPad))));
            let colour = blank;

            //WHICH COLOUR?
            colour = grid[x][y] == 0 ? blank : grid[x][y] == 1 ? red : blue;
            //SATURATE?
            if (saturateColours) {
                if (colour == red) {
                    colour = cgrid[x][y][0] + cgrid[x][y][1] > 0 ? redSat : colour;
                }
                if (colour == blue) {
                    colour = cgrid[x][y][0] + cgrid[x][y][1] > 0 ? blueSat : colour;
                }
            }

            //ARE WE THE TRACE HEX?
            if (traceHex.x == x && traceHex.y == y && !gameStopped) {
                colour = traceHex.colour;
            }

            //DRAW HEX
            ctx.drawImage(sHex, xx, yy);

            ctx.globalCompositeOperation = "darken";
            //COLOUR HEX
            ctx.fillStyle = colour;
            ctx.fillRect(xx, yy, gridRes, gridRes);
            ctx.globalCompositeOperation = "source-over";


            //DRAW CONNECTION DEBUG TEST?
            if (showConnectionValues) {
                ctx.fillStyle = 'black';
                ctx.fillText(cgrid[x][y][0].toString() + cgrid[x][y][1].toString(), xx + (gridRes / 2), yy + (gridRes / 2));
            }
        }
    }
}

//Main loop - Update game and draw hex's
function game_draw(ctx, game) {
    //Main loop
    game_loop();

    //Draw hexs
    game_draw_hexs(ctx);
}
