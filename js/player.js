function Player(game, gameMode) {
  this.game = game;
  this.gameMode = gameMode;
  this.playerSpeed = 200;
  this.playerScale = 1;
  this.playerBody = {};
  this.collisionGroups = {};
  this.playerConstraints = [];
}

Player.prototype.init = function () {
  var playerBody = this.game.cache.getJSON(this.gameMode.playerConfig.config);
  var bodyParts;

  bodyParts = this.game.add.group();
  bodyParts.enableBody = true;
  bodyParts.physicsBodyType = Phaser.Physics.P2JS;

  for (var num in playerBody.limb) {
    var tempSprite = bodyParts.create(100, 200, this.gameMode.playerConfig.ss);
    tempSprite.frameName = playerBody.limb[num].frame;
    tempSprite.name = num;
    tempSprite.scale.setTo(this.playerScale,this.playerScale);
    scalePolygon(
      this.game,
      this.gameMode.playerConfig.physics,
      this.gameMode.playerConfig.scaledPhysics,
      playerBody.limb[num].physics,
      this.playerScale
    );
    tempSprite.body.clearShapes();
  	tempSprite.body.loadPolygon(this.gameMode.playerConfig.scaledPhysics, playerBody.limb[num].physics);
    tempSprite.body.setCollisionGroup(this.gameMode.collisionGroups[playerBody.limb[num].collisionGroup]);
    if ("collides" in playerBody.limb[num])
      for (var i in playerBody.limb[num].collides) {
        tempSprite.body.createGroupCallback(this.gameMode.collisionGroups[playerBody.limb[num].collides[i]], this.gotHit, this);
        tempSprite.body.collides(this.gameMode.collisionGroups[playerBody.limb[num].collides[i]])
      }

    playerBody.limb[num].sprite = tempSprite;
  }

  this.anchorSprite = playerBody.limb[playerBody.anchorLimb].sprite;

  for (var num in playerBody.constraint) {
    var element = playerBody.constraint[num];
    element.pointA = [
      element.pointA[0]*playerBody.limb[element.bodyA].sprite.width + element.transitionPointA[0],
      element.pointA[1]*playerBody.limb[element.bodyA].sprite.height + element.transitionPointA[1]
    ];
    element.pointB = [
      element.pointB[0]*playerBody.limb[element.bodyB].sprite.width + element.transitionPointB[0],
      element.pointB[1]*playerBody.limb[element.bodyB].sprite.height + element.transitionPointB[1]
    ];
    element.limits = [
      Phaser.Math.degToRad(element.limits[0]),
      Phaser.Math.degToRad(element.limits[1])
    ];
    var constraint = createBodyConstraint(
      this.game,
      playerBody.limb[element.bodyA].sprite,
      element.pointA,
      playerBody.limb[element.bodyB].sprite,
      element.pointB,
      element.limits
    );
    this.playerConstraints.push(constraint);
  }

  this.playerBody = playerBody;
  this.bodyParts = bodyParts;
}

Player.prototype.moveLeft = function()  {
  this.anchorSprite.body.moveLeft(this.playerSpeed);
}

Player.prototype.moveRight = function()  {
  this.anchorSprite.body.moveRight(this.playerSpeed);
}

Player.prototype.moveDown = function()  {
  this.anchorSprite.body.moveDown(this.playerSpeed);
}

Player.prototype.moveUp = function()  {
  this.anchorSprite.body.moveUp(this.playerSpeed);
}

Player.prototype.attendHealth = function(health) {
  this.health = health;
}

Player.prototype.gotHit = function (body1, body2) {
  if (body1.sprite.name == "head")
    this.game.camera.shake(0.01, 300)
  else
    this.game.camera.shake(0.001, 300);
  this.game.camera.flash(0xff0000, 300);
  if (!body2.sprite.hitted) {
    body2.sprite.hitted = true;
    this.health.damage(this.playerBody.limb[body1.sprite.name].damage);
    addEmitter(this.game, this.gameMode, body1.sprite, body2.sprite);
    body2.sprite.kill();
  }
}

/*
Player.prototype.kill = function () {
  //TODO: removes constraints though array still the same
  for (constraint in this.playerConstraints)
    this.game.physics.p2.removeConstraint(constraint);
  //this.bodyParts.forEach(this.killBodyPart, this, true);
}

Player.prototype.killBodyPart = function (part) {
  part.body.clearCollision();
  //BUG. NEXT LINE CRASH EVERITHING.
  part.kill();
}
*/

Player.prototype.reinit = function () {
  this.anchorSprite.x = 100;
  this.anchorSprite.y = 200;
  this.health.refresh();
}
