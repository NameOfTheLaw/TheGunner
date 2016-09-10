var gravity = 100,
gameWidth = 700,
gameHeight = 400;

function Game() {
}

Game.prototype.start = function() {
  var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
  var gameMode = new MatrixP2(game);

  function preload() {
    game.load.image('doge','assets/images/doge.jpg');
    game.load.image('background','assets/images/background1.jpg');

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

    gameMode.init();
  }

  function update() {
    gameMode.tick();
  }

  function render() {
    game.debug.text(gameMode.weapon.debug + " | " + gameMode.debug, 20, game.height - 20 );
  }
}
