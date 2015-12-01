// Map fields, change to alter the game setup
var MAP = {
    'cellWidth' : 101,
    'cellHeight' : 83,
    'minX': 1,
    'minY': 1,
    'maxX': 7,
    'maxY': 7
};

MAP.width = MAP.cellWidth*MAP.maxX;
MAP.height = MAP.cellWidth*MAP.maxY;
MAP.startX = Math.round(MAP.maxX/2);
MAP.startY = MAP.maxY;



// Enemies our player must avoid

var Enemy = function(xStartPos,row,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.xStartPos = xStartPos;
    this.pos = [xStartPos,row];
    this.resetPosition();
    this.pos[0] = 0;
    this.speed = speed;
    this.width = 70;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.resetPosition = function() {
    // Converts co-ordinates from the pos array into xy coordinates
    // Note, as the player is in the center of the cell I've
    // opted for 1-based coords instead of zero based, this
    // means we need to decrement the coords before converting to
    // x and y values
    // [-1,-1] and [6,7] are outside the bounds of the grid
    this.x = (this.pos[0]-1)*MAP.cellWidth;
    this.y = (this.pos[1]-1)*MAP.cellHeight;

    //y is slightly off the grid, needs adjustment
    this.y -= 30;
};

Enemy.prototype.restart = function(){
    // this resets an enemy after a game is completed (win or lose)
    this.pos[0] = this.xStartPos;
    this.resetPosition();
    this.pos[0] = 0;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // smooth movement across the screen
    this.x += this.speed*dt;

    // Move the enemy back to the start when it reaches the
    // end of the screen
    if (this.x > MAP.width) {
        this.resetPosition();
    }

    // Check for collision
    if(this.x > (player.x - this.width) &&
        this.x < (player.x + this.width) &&
        this.y == player.y){
        this.onCollision();
    }
};

Enemy.prototype.onCollision = function(){
    player.resetPosition();
    for (var i = 0; i < allEnemies.length; i++) {
        allEnemies[i].restart();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.pos = [3,6];
    this.resetPosition();
    this.sprite = 'images/char-boy.png';
    this.lock = false;
};

Player.prototype.update = function(dt){
    this.handleInput();
    this.updatePosition();
    if (this.pos[1] == MAP.minY){
        this.lock = true;
        this.resetPosition();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.updatePosition = function() {
    // updates player position based on player.pos
    this.setPosition(this.pos[0],this.pos[1]);
};

Player.prototype.resetPosition = function(){
    // Sets the player to the starting position,
    this.pos = [MAP.startX,MAP.startY];
    this.setPosition(MAP.startX, MAP.startY);
};

Player.prototype.setPosition = function(xPos,yPos){
    // Converts co-ordinates from the pos array into xy coordinates
    // Note, as the player is in the center of the cell I've
    // opted for 1-based coords instead of zero based, this
    // means we need to decrement the coords before converting to
    // x and y values
    this.x = (xPos-1)*MAP.cellWidth;
    this.y = (yPos-1)*MAP.cellHeight;

    //y is slightly off the grid, needs adjustment
    this.y -= 30;
};

Player.prototype.handleInput = function(direction) {
    if (!this.lock) {
        switch (direction) {
            case 'left':
            if (this.pos[0] > MAP.minX)
                this.pos[0]--;
            break;
            case 'up':
            if (this.pos[1] > MAP.minY)
                this.pos[1]--;
            break;
            case 'right':
            if (this.pos[0] < MAP.maxX)
                this.pos[0]++;
            break;
            case 'down':
            if (this.pos[1] < MAP.maxY)
                this.pos[1]++;
            break;
        }
    }
    this.updatePosition();
};

var Stars = function(){
    this.sprite = 'images/Star.png';
    this.y = -200;
};

Stars.prototype.update = function(dt){
    if (player.lock && this.y < MAP.height){
        this.y += 3000*dt;
    } else if (player.lock) {
        this.y = -200;
        player.lock=false;
    }
};

Stars.prototype.render = function(){
    for (var i = 0; i <= MAP.maxX; i++) {
        ctx.drawImage(Resources.get(this.sprite), MAP.cellWidth*i, this.y);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var allEnemies = [];
for (var row = 2; row < MAP.maxY-1; row++) {
    var xStartPos = Math.floor(Math.random() * MAP.maxX) + 1;
    var speed = 100 + Math.floor(Math.random() * 200);
    allEnemies.push(new Enemy(xStartPos,row,speed));
    xStartPos += MAP.maxX/2;
    if (xStartPos > MAP.maxX){
        xStartPos -= MAP.maxX;
    }
    allEnemies.push(new Enemy(xStartPos,row,speed));
}


var player = new Player();
var stars = new Stars();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
