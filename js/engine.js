/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
     /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        catchAcorn = 0,
        ctx = canvas.getContext('2d'),
        lastTime,
        winFlag = 1,
        lostFlag = 1,
        bite = new Audio("sounds/bite.wav");



    canvas.width = 909;
    canvas.height = 680;
    doc.body.appendChild(canvas);

     /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

    function main() {
         /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
        dt = (now - lastTime) / 1000.0;
         /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();
         /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;
         /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main(); 
    }

   
    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
     /* calling other functions including:
      * rockCollision, gameOver, collectAcorn and winner
      *
      */
    function update(dt) {
        updateEntities(dt);
        rockCollision();
        gameOver();
        collectAcorn();
        winner();
    }
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */

    function updateEntities(dt) {
        rocks.forEach(function(iceRock) {
            iceRock.update(dt);
        });
        player.update();
    }

    /* This function checks the collision for rock with the player
     * if a collision is detetcted the position of the player is reseted and it loses a life
     * and the poistion of the acron is also reseted. 
     */
    function rockCollision() {
        for (var i = 0; i < rocks.length; i++) {
            if(collide(player,rocks[i],60)) {
                player.resetPosition();
                player.lossLife();
                acorn.resetPosition();
            }
        }
    }

    /* This function lets the player to 'collect' the acorn: 
     * if a collision is detetcted a sound is played and the player image is changed and
     * the variable  catchAcorn is set to one indicating the a acron was collected
     */
    function collectAcorn() {
        if (collide(player, acorn, 60)) {
            player.img = player.withAcorn;
            bite.play();
            acorn.hide();
            catchAcorn=1;
        }
   }


   
    

    //This function checks for collision during the game between any two entities 
    function collide(player,entity,theta) {
        if((entity.x >= (player.x - theta - 20)) && (entity.x <= (player.x + theta + 30))) {
            if ((entity.y >= (player.y - theta + 20)) && (entity.y <= (player.y + theta - 15))){
                return true;
            }
        }
    }

    //This detects the game over, when there is no more life for player left (3 allowed)
    function gameOver() {
        if(player.life === 0) {
            iceRock.speed = 0;
            player.speed = 0;
            player.img = player.sad;
            player.x = 410;
            player.y = 240;
            rocks = [];
            acorn.hide();
            ctx.font = "35px Arial";
            ctx.fillStyle = "red";
            ctx.fillText("Game Over", 350, 45);
            if(lostFlag === 1) {
                lostFlag++;
            }
        }
    }

    /* This function announces the winner when the player has the acron and got to the other side of the river 
     */
    function winner() {
        if((catchAcorn == 1) && (player.y < 120)) {
            iceRock.speed = 0;
            player.speed = 0;
            player.x = 410;
            player.y = 45;
            rocks = [];
            acorn.hide();
            ctx.font = "33px Arial";
            ctx.fillStyle = "Blue";
            ctx.fillText("You Won!", 350, 45);
            if(winFlag === 1) {
                winFlag++;
            }
        }
    }
   
    function render() {
        var rowImages = [
                'images/stone-block.png',   // row of stones
                'images/stone-block.png',   // row of stones
                'images/water-block.png',   // row of water
                'images/water-block.png',   // row of water
                'images/water-block.png',   // row of water
                'images/stone-block.png'    // row of stones
            ],
            numRows = 6,
            numCols = 9,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
    }

    function renderEntities() {
        rocks.forEach(function(iceRock) {
            iceRock.render();
        });
        player.render();
        acorn.render();
    }

    function reset() {
        // noop
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/Rock.png',
        'images/scrat-life.png',
        'images/acorn.png',
        'images/scrat-with-acorn.png',
        'images/scrat-without-acorn.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
