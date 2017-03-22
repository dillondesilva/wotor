var game;

function startGame(context) {
  game = new Phaser.Game(800,
    600,
    Phaser.AUTO,
    context.viewElement,
    { preload: preload, create: create, update: update });
}

function preload () {
  // All the necessary assets for my game so far
  game.load.image('sky', 'assets/space.png');
  game.load.spritesheet('ship', 'assets/spaceship.png', 50, 68, 2);
  game.load.image('bullet', 'assets/playerbullet.png');
  game.load.image('bullet2', 'assets/player2bullet.png');
  game.load.spritesheet('ship2', 'assets/player2ship.png', 65, 61, 2);
  game.load.spritesheet('enemy', 'assets/enemyship.png', 43, 65, 2);
  game.load.image('asteroid', 'assets/asteroid.png');
  game.load.image('enemyBullet', 'assets/enemyBullet.png');
}

// List of necessary global variables
var player1;
var player2;
var cursors;
var bullets;
var bullets2;
var score = 0;
var scoreText;
var enemies;
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
  player2 = game.add.sprite(300, 450, 'ship2');

  // My game will use the Phaser Arcade Physics System
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(player1);
  game.physics.arcade.enable(player2);

  enemies = game.add.group();

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

  // Keys that will be used for the game
  cursors = game.input.keyboard.createCursorKeys();
  waspace = {
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    shoot: game.input.keyboard.addKey(Phaser.Keyboard.Q)
  };

  // Create the element to display the score as text
  scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#999' });

  // Create our emission animations for our characters
  var emissionsP1 = player1.animations.add('emissionsP1');
  player1.animations.play('emissionsP1', 70, true);

  var emissionsP2 = player2.animations.add('emissionsP2');
  player2.animations.play('emissionsP2', 70, true);

  // Set a time loop so that every second, the createEnemy function is called to create an enemy
  game.time.events.loop(Phaser.Timer.HALF, createEnemy, this);
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

  // The following block of code deals with if their is a collision between specific game objects
  game.physics.arcade.overlap(enemyBullets, player1, playerOneDeath, null, this);
  game.physics.arcade.overlap(enemyBullets, player2, playerOneDeath, null, this);
  game.physics.arcade.overlap(bullets, enemies, enemyDeath, null, this);
  game.physics.arcade.overlap(bullets2, enemies, enemyDeath, null, this);
}

function playerOneDeath (bullet, player1) {
  // Kill player 1 and get rid of their bullets
  player1.kill();
  bullet.kill();
  bullets.destroy(true);

  setTimeout(function() {
    player1.revive();
  }, 15000);
}

function playerTwoDeath (bullet, player2) {
  // Kill player 2 and get rid of their bullets
  player2.kill();
  bullet.kill();
  bullets2.destroy(true);
}

function enemyDeath (bullet, enemy) {
  // Deal with putting up the score
  score = score + 100;
  scoreText.text = 'Score: ' + score;

  // Kill the bullet and enemies
  enemy.kill();
}

function createEnemy () {
  // Add our sprite here with a random x co-ordinate
  var enemy = game.add.sprite(Math.floor(Math.random() * 750, 10), -60, 'enemy');

  // Activate the physics system and set gravity on it to 100
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
}, 1000);
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

// Same function as fireBullet except it does it with player 2
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
