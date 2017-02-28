var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload () {
  // All the necessary assets for my game so far
  game.load.image('sky', 'assets/space.png');
  game.load.image('ship', 'assets/spaceship.png');
  game.load.image('bullet', 'assets/playerbullet.png');
  game.load.image('bullet2', 'assets/player2bullet.png');
  game.load.image('ship2', 'assets/player2ship.PNG');
  game.load.image('enemy', 'assets/enemyship.png');
}

// List of necessary global variables
var player1;
var player2;
var cursors;
var bullets;
var bullets2;
var waspace;
var bulletTime = 0;
var bullet2Time = 0;

// Create world
function create () {
  // Sprites
  game.add.sprite(0, 0, 'sky');
  player1 = game.add.sprite(450, 500, 'ship');
  player2 = game.add.sprite(300, 500, 'ship2');

  // My game will use the Phaser Arcade Physics System
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(player1);
  game.physics.arcade.enable(player2);

  // The group of bullets for player one and its setup
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 1);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  // The group of bullets for player two and its setup
  bullets2 = game.add.group();
  bullets2.enableBody = true;
  bullets2.physicsBodyType = Phaser.Physics.ARCADE;
  bullets2.createMultiple(30, 'bullet2');
  bullets2.setAll('anchor.x', 0.5);
  bullets2.setAll('anchor.y', 1);
  bullets2.setAll('outOfBoundsKill', true);
  bullets2.setAll('checkWorldBounds', true);

  // Keys that will be used for the game
  cursors = game.input.keyboard.createCursorKeys();
  waspace = {
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    shoot: game.input.keyboard.addKey(Phaser.Keyboard.Q)
  };

  // Set a time loop so that every second, the createEnemy function is called to create an enemy
  game.time.events.loop(Phaser.Timer.SECOND, createEnemy, this);
}

function update () {
  // The following blocks will have to do with getting input from the keys
  player1.body.velocity.x = 0;
  player2.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player1.body.velocity.x = -180;
  } else if (cursors.right.isDown) {
    player1.body.velocity.x = 180;
  } else {
    player1.frame = 4;
  }

  if (waspace.left.isDown) {
    player2.body.velocity.x = -180;
  } else if (waspace.right.isDown) {
    player2.body.velocity.x = 150;
  } else {
    player2.frame = 4;
  }

  // If the space bar or q is pressed, it will launch the functions to fire each player's bullets respectively
  if (waspace.space.isDown) {
    fireBullet();
  }

  if (waspace.shoot.isDown) {
    fireBulletPlayer2();
  }
}

function createEnemy () {
  // Add our sprite here with a random x co-ordinate
  var enemy = game.add.sprite(game.world.randomX, -60, 'enemy');

  // Activate the physics system and set gravity on it to 100
  game.physics.arcade.enable(enemy);
  enemy.body.gravity.y = 100;
}

// Let's shoot something
function fireBullet () {
  if (game.time.now > bulletTime) {
    // Retrieving the first bullet from the pool
    var bullet = bullets.getFirstExists(false);

    // And Fire!
    if (bullet) {
      bullet.reset(player1.x + 23, player1.y + 8);
      bullet.body.velocity.y = -400;
      bulletTime = game.time.now + 200;
    }
  }
}

function fireBulletPlayer2 () {
  if (game.time.now > bullet2Time) {
    var bullet = bullets2.getFirstExists(false);

    if (bullet) {
      bullet.reset(player2.x + 30, player2.y + 8);
      bullet.body.velocity.y = -400;
      bullet2Time = game.time.now + 200;
    }
  }
}
