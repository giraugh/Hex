function engine_draw() {
    if (document.getElementById('canvas').getContext) {
        var ctx = document.getElementById('canvas').getContext('2d');
    } else {
        alert("BROWSER UNSUPPORTED");
    }
    ctx.fillStyle = game_background();
    ctx.fillRect(0, 0, document.getElementById('canvas').width, document.getElementById('canvas').height);
    game_draw(ctx, window.game);
    updatePressed();
    updateMouse();
    window.requestAnimationFrame(engine_draw);
}

function engine_init() {
    document.getElementById('canvas').width = game_width();
    document.getElementById('canvas').height = game_height();
    document.getElementById('body').style = "background-color:" + game_wbackground() + ";"
    game_init(window.game);
    engine_draw();
}

/*BONUS FUNCTION*/
function log(x) {
    console.log(x);
}

function show(x) {
    console.log(x);
}

/*INITIALIZE GAME*/
window.game = {};
window.game.keys = new Array();

/*KEYBOARD CHECKING*/
for (var i = 0; i < 300; i++) {
    window.game.keys[i] = false;
}
document.onkeypress = function(e) {
    e = e || window.event;
    var code = e.keyCode;
    if (window.game.keys[code] == 0) {
        window.game.keys[code] = 2;
    }
};

document.onkeyup = function(e) {
    e = e || window.event;
    var code = e.keyCode + 32;
    window.game.keys[code] = 0;
};

function getKey(x) {
    if (!(window.document.getElementById('left') == document.activeElement || window.document.getElementById('right') == document.activeElement)) {
        var c = x.charCodeAt(0);
        return window.game.keys[c] > 0;
    }
}

function getKeyPressed(x) {
    if (!(window.document.getElementById('left') == document.activeElement || window.document.getElementById('right') == document.activeElement)) {
        var c = x.charCodeAt(0);
        return window.game.keys[c] == 2 ? true : false;
    }
}

function updatePressed(x) {
    for (var i = 0; i < 300; i++) {
        window.game.keys[i] = window.game.keys[i] == 2 ? 1 : window.game.keys[i];
    }
}

/* MOUSE CHECKING */
mouse = {
    x: 0,
    y: 0,
    left: 0,
    right: 0,
    middle: 0
};

document.onmousemove = function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

document.onmousedown = function(e) {
    if (e.button == 0 && mouse.left == 0) {
        mouse.left = 2;
    }
    if (e.button == 1 && mouse.middle == 0) {
        mouse.middle = 2;
    }
    if (e.button == 2 && mouse.right == 0) {
        mouse.right = 2;
    }
}

document.onmouseup = function(e) {
    if (e.button == 0) {
        mouse.left = 0;
    }
    if (e.button == 1) {
        mouse.middle = 0;
    }
    if (e.button == 2) {
        mouse.right = 0;
    }
}

function updateMouse() {
    mouse.left = mouse.left == 2 ? 1 : mouse.left;
    mouse.middle = mouse.middle == 2 ? 1 : mouse.middle;
    mouse.right = mouse.right == 2 ? 1 : mouse.right;
}

//DISABLE TABBING OUT IN TEXTAREA
    var textareas = document.getElementsByTagName('textarea');
    var count = textareas.length;
    for (var i = 0; i < count; i++) {
        textareas[i].onkeydown = function(e) {
            if (e.keyCode == 9 || e.which == 9) {
                e.preventDefault();
                var s = this.selectionStart;
                this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                this.selectionEnd = s + 1;
            }
        }
    }
