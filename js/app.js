// Enemies our player must avoid


var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.pos = [0,2];
    this.resetPosition();

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
    this.x = (this.pos[0]-1)*cellWidth;
    this.y = (this.pos[1]-1)*cellHeight;

    //y is slightly off the grid, needs adjustment
    this.y -= 30;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += cellWidth*dt;
    if (this.x > canvasWidth-cellWidth) {
        this.resetPosition();
    }
    this.render();

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
    this.setPosition();
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(dt){
    this.handleInput();
    this.setPosition();
    this.render();
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.setPosition = function() {
    // Converts co-ordinates from the pos array into xy coordinates
    // Note, as the player is in the center of the cell I've
    // opted for 1-based coords instead of zero based, this
    // means we need to decrement the coords before converting to
    // x and y values
    this.x = (this.pos[0]-1)*cellWidth;
    this.y = (this.pos[1]-1)*cellHeight;

    //y is slightly off the grid, needs adjustment
    this.y -= 30;
}

Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case "left":
            if (this.pos[0] > 1)
                this.pos[0]--;
            break;
        case "up":
            if (this.pos[1] > 1)
                this.pos[1]--;
            break; 
        case "right":
            if (this.pos[0] < 5)
                this.pos[0]++;
            break;
        case "down":
            if (this.pos[1] < 6)
                this.pos[1]++;
            break;
    }
}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemy = new Enemy();

var allEnemies = [];
allEnemies.push(enemy);

var player = new Player


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
