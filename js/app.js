/* app.js
 * This file provides the game objects and their functions besides the event handling function
 * The file defien the IceRock, Player and Acron objects and initailze them in the game.
 * The file also has the definition of the Player.prototype.handleInput 
 * the main function to handle input from the user to move the scrat. 
 */

//Constants values declaration 

var PLAYER_StrtX = 0, 
    PLAYER_StrtY = 497,
    ROCK_StrtX = -40,
    ROCK_StrtY = [142, 225, 308], // array to pick random values of y coordinates 
    ROCK_Speed = [50,100,150, 200, 400, 500], // array to pick random values of rocks speeds
    player_life = 3, // number of lifes for the player
    ACORN_X = [0,101,202,303,404,505,606,707,808], // array to pick random x coordinates for acorn
    ACORN_Y = [142, 225, 308, 391]; // array to pick random y coordinates for acorn


//IceRock: rocks which the player should avoid
// it has image, x, y, and a speed.
var IceRock = function() {
    this.img = 'images/Rock.png';
    this.x = ROCK_StrtX;
    this.y = ROCK_StrtY[Math.floor(Math.random()*4)]; // picking random number from the array
    this.speed = ROCK_Speed[Math.floor(Math.random()*6)];
}
// Update the iceRock's position
// Parameter: dt, a time delta between ticks
IceRock.prototype.update = function(dt) {
        if(this.x > 950)
        {
            this.x = ROCK_StrtX;
            this.y = ROCK_StrtY[Math.floor(Math.random()*4)];
            this.speed = ROCK_Speed[Math.floor(Math.random()*6)];
        }
        this.x = this.x + (this.speed*dt);
}
//Renders the bug img on the canvas
IceRock.prototype.render = function() {
        ctx.drawImage(Resources.get(this.img), this.x, this.y);
}
//Creating a new iceRock object 
var iceRock = new IceRock();
var rocks = [iceRock]; // creating an array of rocks


//this function is to create as many rocks as the n paramter
function createIceRock(n) {
    for (var i = 0; i < n; i++) {
        var createIceRock = new IceRock();
        rocks.push(createIceRock);
    }
}
// creating three rocks initailly 
createIceRock(3);

//Player: the players in this game are scrats
// they have defualt image, image when they collect the acorn, x, y, speed, and number of lives
var Player = function(x,y,life) {
    this.img = 'images/scrat-without-acorn.png';
    this.withAcorn = 'images/scrat-with-acorn.png';
    this.playerLife = 'images/scrat-life.png';
    this.x = x;
    this.y = y;
    this.speed = 8;
    this.life = life;
};
// Update the player's position
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    this.x * dt + this.speed;
    this.y * dt + this.speed;
};
//Renders player img on the canvas and its lives indicating the 
//number of chances left to play again after being hit by a rock
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.img), this.x, this.y);
    var positionX = 0
    for (var i = 1; i <= this.life; i++) {
        ctx.drawImage(Resources.get(this.playerLife), 10 + positionX, 50);
        positionX += 70;
    }
};
//This function resets the position of the player after beeing hit by a rock
Player.prototype.resetPosition = function() {
    this.x = PLAYER_StrtX;
    this.y = PLAYER_StrtY;
    this.img = 'images/scrat-without-acorn.png';
};
//This function reduces the life of the player after collision with a rock
Player.prototype.lossLife = function() {
    this.life-- ;
};
//This function moves the player around the 
//canvas based on the arrow keys pushed
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            if (this.x < -40){
                this.x = 880;
            } else {
                this.x -= this.speed;
            }
            break;  
        case 'right':
            if (this.x > 880){
                this.x = -40;
            } else {
                this.x += this.speed;
            }
             break;
        case 'up':
            if (this.y < 1){
            } else {
                this.y -= this.speed;
            }
            break;
        case 'down':
            if(this.y > 500){
            } else {
                this.y += this.speed;
            }
            break;
        default :
                return;
    }
};
// creating one player initailly
var player = new Player(PLAYER_StrtX, PLAYER_StrtY, player_life);
// end player function






//Player needs to collect the acron and go to the other side of the river
// Acron obect has a image, x and y.
var Acorn = function() {
    this.img = 'images/acorn.png';
    this.x = ACORN_X[Math.floor(Math.random()*9)];
    this.y = ACORN_Y[Math.floor(Math.random()*4)];
};
// this function draws the acorn 
Acorn.prototype.render = function() {
    ctx.drawImage(Resources.get(this.img), this.x, this.y);
};
//This function hides the acorn by putting it in negative x and y axis 
//after it is collected by player.
Acorn.prototype.hide = function() {
    this.x = -800;
    this.y = -800;
};
//This function resets the position of milk bottle 
//after it is given to baby via giveMb() function in engine.js  
Acorn.prototype.resetPosition = function() {
    this.x = ACORN_X[Math.floor(Math.random()*9)];
    this.y = ACORN_Y[Math.floor(Math.random()*4)];
};
//Creates a new object acorn of class Acorn
var acorn = new Acorn();



//Event function
//listens for the keyboard events and move the player accoring the events by calling handleInput
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37  : 'left',
        38  : 'up',
        39  : 'right',
        40  : 'down',
        32  : 'jump'
    };
    if (e.keyCode in allowedKeys){
        e.preventDefault();
    }
    player.handleInput(allowedKeys[e.keyCode]);
});
//end of event function