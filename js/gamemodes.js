function GameMode() {
}

GameMode.prototype.tick = function () {
  this.update();
}

function MatrixP1(game) {
    this.game = game;
    this.collisionGroups = {};
}

function MatrixP2(game) {
    this.game = game;
    this.collisionGroups = {};
}

MatrixP1.prototype = Object.create(GameMode.prototype);
MatrixP2.prototype = Object.create(MatrixP1.prototype);

MatrixP1.prototype.init = function() {
  this.collisionGroups.torso = this.game.physics.p2.createCollisionGroup();
  this.collisionGroups.hands = this.game.physics.p2.createCollisionGroup();
  this.collisionGroups.head = this.game.physics.p2.createCollisionGroup();
  this.collisionGroups.legs = this.game.physics.p2.createCollisionGroup();
  this.collisionGroups.bullets = this.game.physics.p2.createCollisionGroup();
  //AFTER CREATING COLLISION GROUPS IT IS IMPORTANT TO UPDATE:
  this.game.physics.p2.updateBoundsCollisionGroup();

  this.player = new Player(this.game, this);
  this.player.init();
  this.weapon = new Weapon(this.game, this);

  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.mouse = this.game.input.activePointer;
}

MatrixP1.prototype.update = function() {
  //take a fire
  this.weapon.refresh();
  this.weapon.aimTo(this.player.playerBody.limb.torso.sprite);
  this.weapon.fire();

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
}

MatrixP2.prototype.update = function() {
  if (this.weapon.isReloading()) {
    this.debug = "RELOADING " + Phaser.Math.roundTo((this.weapon.nextShot - this.game.time.now) / 1000, -2);
  } else {
    this.debug = "READY";
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
}
