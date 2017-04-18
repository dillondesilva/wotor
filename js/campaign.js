var game;

function campaign(context) {
  game = new Phaser.Game(800,
    600,
    Phaser.AUTO,
    context.viewElement,
    { preload: preload, create: create, update: update});
}

function preload () {
  // All the necessary assets for my game so far
  game.load.image('sky', 'assets/space.png');
  game.load.spritesheet('ship', 'assets/spaceship.png', 50, 68, 2);
  game.load.image('bullet', 'assets/playerbullet.png');
  game.load.spritesheet('enemy', 'assets/enemyship.png', 43, 65, 2);
  game.load.spritesheet('explosion', 'assets/explosion.png', 32, 32, 18);
  game.load.image('asteroid', 'assets/rock.png');
  game.load.image('enemyBullet', 'assets/enemyBullet.png');
}

// List of necessary global variables
var player1;
var cursors;
var bullets;
var score = 0;
var scoreText;
var explosions;
var enemies;
var asteroids;
var enemyBullets;
var waspace;
var bulletTime = 0;
var bullet2Time = 0;
var enemyBulletTime = 0;

// Create world
function create () {
  // Sprites
  game.add.sprite(0, 0, 'sky');
  player1 = game.add.sprite(400, 450, 'ship');

  // My game will use the Phaser Arcade Physics System
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(player1);

  enemies = game.add.group();
  asteroids = game.add.group();

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

  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(30, 'enemyBullet');
  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 1);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  explosions = game.add.group();
  explosions.createMultiple(30, 'explosion');

  // Keys that will be used for the game
  cursors = game.input.keyboard.createCursorKeys();
  waspace = {
    space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
  };

  // Create the element to display the score as text
  scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#999' });

  // Create our emission animations for our characters
  player1.animations.add('emissionsP1');
  player1.animations.play('emissionsP1', 70, true);

  // Set a time loop so that every second, the createEnemy function is called to create an enemy
  game.time.events.loop(Phaser.Timer.SECOND, createEnemy, this);

  // Set a time loop so that every second, the createAsteroid function is called to create an asteroid
  game.time.events.loop(Phaser.Timer.SECOND, createAsteroid, this);
}

function update () {
  // The following blocks will have to do with getting input from the keys
  player1.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player1.body.velocity.x = -180;
  } else if (cursors.right.isDown) {
    player1.body.velocity.x = 180;
  } else {
    player1.frame = 4;
  }

  // If the space bar is pressed, it will launch the functions to fire each player 1s bullets
  if (waspace.space.isDown) {
    fireBullet();
  }

  // The following block of code deals with if their is a collision between specific game objects
  game.physics.arcade.overlap(player1, enemyBullets, playerOneDeath, null, this);
  game.physics.arcade.overlap(bullets, enemies, enemyDeath, null, this);
  game.physics.arcade.overlap(player1, enemies, playerOneDeath, null, this);
}

function playerOneDeath (player1, bullet) {
  // Create an explosion
  player1.loadTexture('explosion');
  player1.animations.add('kaboom');
  player1.animations.play('kaboom', 35, false, true);
}

function enemyDeath (bullet, enemy) {
  // Deal with putting up the score
  score = score + 100;
  scoreText.text = 'Score: ' + score;

  // Create an explosion
  var kaboom = explosions.getFirstExists(false);
  kaboom.reset(enemy.body.x, enemy.body.y);
  kaboom.play('explosion', 30, false);

  // Kill the bullet and enemies
  enemy.kill();
}

function createEnemy () {
  // Add our sprite here with a random x co-ordinate
  var enemy = game.add.sprite(Math.floor(Math.random() * 750, 10), -60, 'enemy');

  // Activate the physics system and set gravity on it to 250
  game.physics.arcade.enable(enemy);
  enemy.body.gravity.y = 250;
  enemy.checkWorldBounds = true;
  enemy.outOfBoundsKill = true;

  enemies.add(enemy);


  var emissionsEnemy = enemy.animations.add('emissionsEnemy');
  enemy.animations.play('emissionsEnemy', 70, true);

  // Makes the enemy fire their bullet 1 second after spawn
  setTimeout(function() {
    fireEnemyBullet(enemy);
}, 0);
}

function createAsteroid () {
  // Uses the same process for adding the enemies with a random x coordinate except it does it with the asteroid sprite
  var asteroid = game.add.sprite(Math.floor(Math.random() * 750, 10), -60, 'asteroid');

  // Activate the physics system and set gravity on it to 250
  game.physics.arcade.enable(asteroid);
  asteroid.body.gravity.y = 250;
  asteroid.checkWorldBounds = true;
  asteroid.outOfBoundsKill = true;
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

// Fires an enemy bullet exactly like player one and two except it is called differently. Scroll up to see
function fireEnemyBullet (enemy) {
    if (game.time.now > enemyBulletTime) {
      var bullet = enemyBullets.getFirstExists(false);

      if (bullet) {
        bullet.reset(enemy.x + 40, enemy.y + 8);
        bullet.body.velocity.y = 400;
        enemyBulletTime = game.time.now + 200;
      }
    }
}
