var gravity = 100,
gameWidth = 700,
gameHeight = 400,
playerSpeed = 200;

function Game() {

}

Game.prototype.start = function() {
  var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
  var cursors, fireButton;
  var player, obstacle;

  function preload() {
    game.load.image('doge','assets/images/doge.jpg');
    game.load.image('background','assets/images/background1.jpg');
    //game.load.spritesheet('bullets','assets/images/bullets.svg', 12, 52, 4);

    game.load.atlas('player_atlas', 'assets/spritesheet/player_spritesheet.png', '/assets/spritesheet/player_spritesheet.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    game.load.physics('playerPhysicsData', 'assets/physics/player_spritesheet.json');
    game.load.atlas('bullets_atlas', 'assets/spritesheet/gun_spritesheet.png', '/assets/spritesheet/gun_spritesheet.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    game.load.physics('gunPhysicsData', 'assets/physics/gun_spritesheet.json');
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.gravity.y = gravity;

    //spritesheet-background with doge
    //var background = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'doge');
    //background.tileScale.x = 0.2;
    //background.tileScale.y = 0.2;

    var background = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'background');

    player = new Player(game);
    player.init();

    obstacle = new Obstacle(game, player);
    obstacle.init();

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  }

  function update() {
    if (cursors.left.isDown) {
      player.moveLeft();
    } else if (cursors.right.isDown) {
      player.moveRight();
    }

    if (cursors.up.isDown) {
      player.moveUp();
    } else if (cursors.down.isDown) {
      player.moveDown();
    }

    obstacle.changeFireDirection();
    obstacle.weapon.fire();

    /*
    if (fireButton.isDown)
    {
        obstacle.weapon.fire();
    }
    */
  }

  function render() {
    game.debug.text( player.debug + obstacle.debug, 20, game.height - 20 );
  }
}
