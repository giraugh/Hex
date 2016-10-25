//Adding examples to global object for easy demo'ing

window.examples = {}

examples["bridge"] = function (){
    if (turnCount < 20) {
    	//SET UP LINE
    	var x = round(turnCount/2);
    	var y = round(turnCount/2);
    	var a = 64;
    	while (a > 0 && !empty(x,y))
    	{x += rnd(2)-1;y += rnd(2)-1;}
    	return hex(x,y)
    }else{
    	//FILL IN
    	function evaluate(board)
    	{
    		var score = 0;
    		for (var i=0;i<gridSize;i++)
    		{
    			for (var j=0;j<gridSize;j++)
    			{
    				//IF ITS OUR PEICE
    				if (board[i][j] == turn+1)
    				{
    					//GET SCORE FOR BEING NEAR US
    					score += neighbours_ext(i,j,red,board)+(neighbours_ext(i,j,blue,board)/2);
    					score -= (neighbours_ext(i,j,red,board)>3)*2;
    				}
    			}
    		}

    		//IF WE DO THIS DO WE WIN?
    		if (will_win(board) == turn+1)
    		{
    			//THEN DO IT!
    			score += 1000;
    		}

    		return score;
    	}

    	//GET ALL POSIBLE MOVES
    	var moves = new Array();
    	for (i=0;i<gridSize;i++)
    	{
    		for (j=0;j<gridSize;j++)
    		{
    			if (empty(i,j))
    			{
    				moves.push({x: i,y: j});
    			}
    		}
    	}


    	//CREATE ARRAY OF SCORES
    	var scores = new Array();

    	//CREATE WORKING COPY
    	for (i=0;i<moves.length;i++)
    	{
    		var work = clone();
    		perform_move(work, moves[i].x, moves[i].y)
    		scores.push(evaluate(work));
    	}


    	//CHOOSE MOVE BY LOOKING AT SCORES
    	var best = -999;
    	var bestI = 0;
    	for (i=0;i<scores.length;i++)
    	{
    		if (scores[i] > best)
    		{
    			best = scores[i];
    			bestI = i;
    		}
    	}

    	return hex(moves[bestI].x,moves[bestI].y);
    }
}
examples["bucket"] = function (){

	//FIRST TURN IS CENTRE
	if (isFirstTurn() && empty(5,5))
	{
		return hex(5,5);
	}

	//DEFINE EVALUATE FUNCTION
	function evaluate(board)
	{
		var score = 0;
		for (var i=0;i<gridSize;i++)
		{
			for (var j=0;j<gridSize;j++)
			{
				//IF ITS OUR PEICE
				if (board[i][j] == turn+1)
				{
					//GET SCORE FOR BEING NEAR US
					score += neighbours_ext(i,j,red,board);
					score -= Math.abs(gridSize/2 - i)*((turn==0) ? 0.75 : 1.0);
					score -= Math.abs(gridSize/2 - j)*((turn==1) ? 0.75 : 1.0);
				}
			}
		}

		//IF WE DO THIS DO WE WIN?
		if (will_win(board))
		{
			//THEN DO IT!
			score += 1000;
		}

		return score;
	}

	//GET ALL POSIBLE MOVES
	var moves = new Array();
	for (i=0;i<gridSize;i++)
	{
		for (j=0;j<gridSize;j++)
		{
			if (empty(i,j))
			{
				moves.push({x: i,y: j});
			}
		}
	}


	//CREATE ARRAY OF SCORES
	var scores = new Array();

	//CREATE WORKING COPY
	for (i=0;i<moves.length;i++)
	{
		var work = clone();
		perform_move(work, moves[i].x, moves[i].y)
		scores.push(evaluate(work));
	}


	//CHOOSE MOVE BY LOOKING AT SCORES
	var best = -999;
	var bestI = 0;
	for (i=0;i<scores.length;i++)
	{
		if (scores[i] > best)
		{
			best = scores[i];
			bestI = i;
		}
	}

	return hex(moves[bestI].x,moves[bestI].y);
}
examples["clock-random"] = function (){
	let x = round(Math.random()*(gridSize-1)/2);
  let y = round(Math.random()*(gridSize-1)/2);
  if (!empty(x, y))
  {
  	x = round(clamp(Math.random(),0.5,1.0)*(gridSize-1));
  	y = round(clamp(Math.random(),0.5,1.0)*(gridSize-1));
  	if (!empty(x, y))
  	{
  		x = round(clamp(Math.random(),0.5,1.0)*(gridSize-1));
  		y = round(Math.random()*(gridSize-1)/2);
  		if (!empty(x, y))
  		{
  			x = round(Math.random()*(gridSize-1)/2);
  			y = round(clamp(Math.random(),0.5,1.0)*(gridSize-1));
  		}
  	}
  }

  return hex(x,y);
}
examples["line"] = function (){
	var range = 4
	var x = 0
	var y = 0

    x = rndg()
    y = 5+rnd(range-1)-round((range)/2)+1
    if (turn == PLAYER1)
        return hex(x,y)
    else
        return hex(y,x)
}
examples["player-controlled"] = function (){
  console.log(this)
  let r = keyPressed('d');
  let l = keyPressed('a');
  let u = keyPressed('w');
  let d = keyPressed('s');
  let h = r - l;
  let v = d - u;
  this.x += h;
  this.y += v;
  trace(this.x, this.y, turn ? blueSat : redSat);
  if (keyPressed("e" || getKey(InputCodes.enter, true))) {
    return hex(this.x, this.y);
    } else {
    return hex(-1, -1);
  }
};
examples["turtle"] = function (){
    //CREATE LOCAL REFERENCE
    let turtle = this.turtle

    //MOVE
    switch (turtle.state)
    {
        case "up" :
            turtle.y --
            break

        case "down" :
            turtle.y ++
            break

        case "right" :
            turtle.x ++
            break

        case "left" :
            turtle.x --
            break
    }

    //CHANGE STATE
    if (turtle.moves == 0)
    {
        switch (turtle.state)
        {
            case "up" :
                turtle.state = "right"
                break

            case "right" :
                turtle.state = "down"
                break

            case "down" :
                turtle.state = "left"
                break

            case "left" :
                turtle.state = "up"
                break
        }

        turtle.max ++
        turtle.moves = turtle.max
    }
    else
    {
        turtle.moves -= 1
    }

    //CLAMP TO GRID
    turtle.x = clamp(turtle.x, 0, gridSize-1)
    turtle.y = clamp(turtle.y, 0, gridSize-1)

    //TRACE (Green for turtle colours)
    trace(turtle.x, turtle.y, "green");

    //RETURN
    return hex(turtle.x, turtle.y);
}
