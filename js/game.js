var gravity = 200,
gameWidth = 780,
gameHeight = 480,
debug = "",
gameInfo = "",
roomScale = 1.7;

function Game() {
}

Game.prototype.play = function() {
  var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
  var gameMode = new MatrixP1(game);

  function preload() {
    game.load.json('config','assets/config/config.json');

    game.load.image('background','assets/images/background1.jpg');

    game.load.spritesheet('start_button','assets/spritesheet/start_button.png', 200, 80);
    game.load.spritesheet('restart_button','assets/spritesheet/restart_button.png', 200, 80);

    /*
    game.load.atlas(config.player.ss, config.player.ss_src, config.player.ssAtlas_src, null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    game.load.physics(config.player.physics, config.player.physics_src);
    game.load.json(config.player.config, config.player.config_src);
    */

    game.load.atlas('player_atlas', 'assets/spritesheet/player_spritesheet.png', 'assets/spritesheet/player_spritesheet.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    game.load.physics('playerPhysicsData', 'assets/physics/player_spritesheet.json');
    game.load.json('player', 'assets/config/player_configuration.json');

    game.load.atlas('bullets_atlas', 'assets/spritesheet/gun_spritesheet.png', 'assets/spritesheet/gun_spritesheet.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    game.load.physics('gunPhysicsData', 'assets/physics/gun_spritesheet.json');
    game.load.json('bullets', 'assets/config/gun_configuration.json');
  }

  function create() {
    game.time.advancedTiming = true;
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.gravity.y = gravity;

    var background = game.add.tileSprite(0, 0, gameWidth*roomScale, gameHeight*roomScale, 'background');

    game.world.setBounds(0, 0, gameWidth*roomScale, gameHeight*roomScale);

    this.startButton = game.add.button(
      gameWidth/2, gameHeight/2,
      'start_button',
      startGame, this, 1, 0, 2
    );
    this.startButton.fixedToCamera = true;
    this.startButton.anchor.x = 0.5;
    this.startButton.anchor.y = 0.5;

    //gameMode.init();
    this.gameMode = gameMode;
  }

  function update() {
    if (!gameMode.isOver()) {
      if (gameMode.isStarted()) {
        gameMode.update();
      }
    } else if (this.restartButton === undefined || !this.restartButton.alive) {
      this.restartButton = game.add.button(
        gameWidth/2, gameHeight/2,
        'restart_button',
        restartGame, this, 1, 0, 2
      );
      this.restartButton.fixedToCamera = true;
      this.restartButton.anchor.x = 0.5;
      this.restartButton.anchor.y = 0.5;
    }
  }

  function render() {
    game.debug.text(debug, 20, 20);
    game.debug.text(gameInfo, 20, gameHeight - 20);
    game.debug.text(game.time.fps + " fps", gameWidth - 65, 20);
  }

  function startGame() {
    this.startButton.kill();
    this.gameMode.init();
  }

  function restartGame() {
    if (this.restartButton.alive)
      this.restartButton.kill();
    this.gameMode.reinit();
  }
}

function scalePolygon(game, originalPhysicsKey, newPhysicsKey, shapeKey, scale) {
  var newPolygon = [];
  var data = game.cache.getPhysicsData(originalPhysicsKey, shapeKey);
  for (var i = 0; i < data.length; i++) {
    var newShape = [];
    for (var j = 0; j < data[i].shape.length; j++) {
      newShape[j] = data[i].shape[j] * scale;
    }
    newPolygon.push({shape: newShape});
  }
  var item = {};
  item[shapeKey] = newPolygon;
  game.load.physics(newPhysicsKey, '', item);
}

function createBodyConstraint(game, spriteA, pointA, spriteB, pointB, limitsB) {
  var constraint = game.physics.p2.createRevoluteConstraint(spriteA, pointA, spriteB, pointB);
  if (limitsB) constraint.setLimits(limitsB[0], limitsB[1]);
  return constraint;
}

function addEmitter(game, gameMode, sprite1, sprite2) {
  var emitter = game.add.emitter();
  emitter.makeParticles('bullets_atlas');
  emitter.gravity = 200;
  emitter.sprite = sprite1;
  emitter.start(false, 2000, 50, 10);
  gameMode.emittersList.push(emitter);
  debug = gameMode.emittersList.length;

  // And 2 seconds later we'll destroy the emitter
  game.time.events.add(2000, destroyEmitter, {"gameMode": gameMode, "emitter": emitter});
}

function destroyEmitter() {
  this.emitter.destroy();
}
