function GameMode(game) {
    this.game = game;
    this.collisionGroups = {};
    this.gameOver = false;
    this.started = false;
    this.emittersList = [];
}

GameMode.prototype.isOver = function () {
  return this.gameOver;
}

GameMode.prototype.isStarted = function () {
  return this.started;
}

function MatrixP1(game) {
    this.game = game;
    this.collisionGroups = {};
    this.gameOver = false;
    this.started = false;
    this.emittersList = [];
}

function MatrixP2(game) {
    this.game = game;
    this.collisionGroups = {};
    this.gameOver = false;
    this.started = false;
    this.emittersList = [];
}

MatrixP1.prototype = Object.create(GameMode.prototype);
MatrixP2.prototype = Object.create(MatrixP1.prototype);

MatrixP1.prototype.init = function() {
  var config = this.game.cache.getJSON('config');
  this.gunConfig = config.gun;
  this.playerConfig = config.player;

  this.collisionGroups.torso = this.game.physics.p2.createCollisionGroup();
  this.collisionGroups.hands = this.game.physics.p2.createCollisionGroup();
  this.collisionGroups.head = this.game.physics.p2.createCollisionGroup();
  this.collisionGroups.legs = this.game.physics.p2.createCollisionGroup();
  this.collisionGroups.bullets = this.game.physics.p2.createCollisionGroup();
  //AFTER CREATING COLLISION GROUPS IT IS IMPORTANT TO UPDATE:
  this.game.physics.p2.updateBoundsCollisionGroup();

  this.player = new Player(this.game, this);
  this.player.init();
  this.health = new HealthBar({total: 80});
  this.player.attendHealth(this.health);
  this.weapon = new Weapon(this.game, this);
  this.weapon.showWarnings = true;
  this.weapon.aimTo(this.player.anchorSprite);

  //The smaller the value, the smooth the camera
  this.game.camera.follow(this.player.anchorSprite, Phaser.Camera.FOLLOW_LOCKON, 0.07, 0.07);
  //In the rectangle camera'll not follow the sprite
  this.game.camera.deadzone = new Phaser.Rectangle(150, 150, gameWidth - 300, gameHeight - 300);
  //this.game.camera.setSize(gameWidth, gameHeight/2);

  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.mouse = this.game.input.activePointer;
  this.started = true;
}

MatrixP1.prototype.update = function() {
  //take a fire
  this.weapon.refresh();
  this.weapon.fire();

  //moves active emmiters and removes destroyed emitters
  for (var i = 0; i< this.emittersList.length; i++) {
    if (!this.emittersList[i].alive) {
      this.emittersList.splice(i, 1);
    } else {
      this.emittersList[i].x = this.emittersList[i].sprite.x;
      this.emittersList[i].y = this.emittersList[i].sprite.y;
    }
  }

  //take moves
  if (this.cursors.left.isDown) {
    this.player.moveLeft();
  } else if (this.cursors.right.isDown) {
    this.player.moveRight();
  }

  if (this.cursors.up.isDown) {
    this.player.moveUp();
  } else if (this.cursors.down.isDown) {
    this.player.moveDown();
  }

  if (this.health.count <= 0) {
    gameInfo = "0/" + this.health.total + " HP";
    this.gameOver = true;
  } else {
    gameInfo = this.health.count + "/" + this.health.total + " HP";
  }

}

MatrixP1.prototype.reinit = function() {
  this.started = false;
  this.gameOver = false;
  this.weapon.reinit();
  this.player.reinit();
  this.started = true;
}

MatrixP2.prototype.update = function() {
  if (this.weapon.isReloading()) {
    debug = "RELOADING " + Phaser.Math.roundTo((this.weapon.nextShot - this.game.time.now) / 1000, -2);
  } else {
    debug = "READY";
  }

  if (this.cursors.left.isDown) {
    this.player.moveLeft();
  } else if (this.cursors.right.isDown) {
    this.player.moveRight();
  }

  if (this.cursors.up.isDown) {
    this.player.moveUp();
  } else if (this.cursors.down.isDown) {
    this.player.moveDown();
  }

  if (this.mouse.leftButton.isDown) {
    this.weapon.fire([this.mouse.x, this.mouse.y])
  }

  if (this.health.count <= 0) {
    gameInfo = "0/" + this.health.total + " HP";
    if (this.isStarted()) this.gameOver = true;
  } else {
    gameInfo = this.health.count + "/" + this.health.total + " HP";
  }
}

function HealthBar(options) {
  var defaultOptions = {
    total: 100,
    regeneration: 1
  }
  for (var option in defaultOptions) this[option] = options && (options[option] !== undefined ? options[option] : defaultOptions[option]);
  this.count = this.total;
}

HealthBar.prototype.damage = function(damageCount) {
  this.count -= damageCount;
}

HealthBar.prototype.refresh = function() {
  this.count = this.total;
}
