function Weapon(game, gameMode, options) {
  var defaultOptions = {
    weaponSpeed: 1500,
    bulletSpeed: 170,
    bulletScale: 0.6,
    warningColor: 0xee0000,
    warningSize: 20
  }
  for(var option in defaultOptions) this[option] = options && options[option]!==undefined ? options[option] : defaultOptions[option];
  this.game = game;
  this.gameMode = gameMode;
  this.debug = "no hit";
  this.showWarnings = false;
  this.nextShot = 0;
  //this.defaultFrom = [gameWidth, gameHeight/2];
  this.defaultFrom = [this.game.world.width, this.game.world.height/2]
  this.bulletsInfo = this.game.cache.getJSON('bulletsInfo');

  this.bulletGroup = this.game.add.group();
  this.bulletGroup.enableBody = true;
  this.bulletGroup.physicsBodyType = Phaser.Physics.P2JS;
}

Weapon.prototype.fire = function (to, from) {
  if (this.game.time.now < this.nextShot && this.nextShot != 0) {
    return false;
  }

  if (!from) {
    from = this.defaultFrom;
  }

  if (!to)
    if (this.aim) {
      to = [this.aim.x, this.aim.y];
    } else {
      return false;
    }

  var bullet = this.bulletGroup.create(from[0], from[1], this.bulletsInfo.image);
  var bulletAngle = Phaser.Math.angleBetween(to[0],  to[1], from[0],  from[1]);
  bullet.frame = this.bulletsInfo.ammo[0].shape;
  bullet.body.rotation = bulletAngle;
  bullet.body.kinematic = true;
  bullet.body.velocity.y = -this.bulletSpeed * Math.sin(bulletAngle);
  bullet.body.velocity.x = -this.bulletSpeed * Math.cos(bulletAngle);
  bullet.name = "bullet";
  bullet.scale.setTo(this.bulletScale,this.bulletScale);
  scalePolygon(this.game, this.bulletsInfo.physics, this.bulletsInfo.scaledPhysics, this.bulletsInfo.ammo[0].physics, this.bulletScale);
  bullet.body.clearShapes();
  bullet.body.loadPolygon("scaledGunPhysicsData", "bullet1");
  bullet.body.setCollisionGroup(this.gameMode.collisionGroups.bullets);
  for (var colGroup in this.gameMode.collisionGroups)
    if (colGroup != "bullets") {
      bullet.body.collides(this.gameMode.collisionGroups[colGroup]);
      //bullet.body.createGroupCallback(this.gameMode.collisionGroups[colGroup], this.hitTheBody, this);
    }

  this.nextShot = this.game.time.now + this.weaponSpeed;
  return true;
}

Weapon.prototype.fireToSprite = function (toSprite, from) {
  if (!from) {
    return this.fire([toSprite.x, toSprite.y]);
  } else {
    return this.fire([toSprite.x, toSprite.y], from);
  }
}

Weapon.prototype.refresh = function () {
  this.bulletGroup.forEach(this.destoyBullet, this, true);
  if (this.showWarnings) {
    this.bulletGroup.forEach(this.drawWarning, this, true);
  }
}

Weapon.prototype.drawWarning = function (bullet) {
  //TODO: function gets fps down
  if (bullet.x > this.game.camera.x + this.game.camera.width) {
    var x1 = this.game.camera.x + this.game.camera.width/2,
      y1 = this.game.camera.y + this.game.camera.height/2,
      x = x1 + this.game.camera.width/2,
      y = function (x) {
        return (x - x1)/(bullet.x - x1)*(bullet.y - y1) + y1;
      };

    if (bullet.wGraphics === undefined) {
      bullet.wGraphics = this.game.add.graphics();
    } else {
      bullet.wGraphics.clear();
    }
    bullet.wGraphics.x = x;
    bullet.wGraphics.y = y(x);
    bullet.wGraphics.beginFill(
      this.warningColor,
      Phaser.Math.distance(bullet.x, bullet.y, this.game.world.width, y(this.game.world.width))/Phaser.Math.distance(x1, y1, this.game.world.width, y(this.game.world.width))
    );
    bullet.wGraphics.drawCircle(this.warningSize/4, 0, this.warningSize);
    bullet.wGraphics.endFill();
  } else if (bullet.wGraphics !== undefined && bullet.wGraphics.alive) {
    bullet.wGraphics.clear();
    bullet.wGraphics.kill();
  }
}

Weapon.prototype.destoyBullet = function (bullet) {
  if (bullet.x < 0 - bullet.height - bullet.width
    || bullet.x > this.game.world.width + bullet.height + bullet.width
    || bullet.y < 0 - bullet.height - bullet.width
    || bullet.y > this.game.world.height + bullet.height +bullet.width) {
    bullet.destroy();
  }
}

Weapon.prototype.hitTheBody = function (body1, body2) {
  debug = body2.sprite.name + " was hitted";
  body1.sprite.kill();
}

Weapon.prototype.aimTo = function (sprite) {
  this.aim = sprite;
}

Weapon.prototype.removeAim = function () {
  this.aim = false;
}

Weapon.prototype.isReloading = function () {
  if (this.game.time.now < this.nextShot && this.nextShot != 0) {
    return true;
  } else {
    return false;
  }
}

Weapon.prototype.reinit = function () {
  this.bulletGroup.destroy();
  this.bulletGroup = this.game.add.group();
  this.bulletGroup.enableBody = true;
  this.bulletGroup.physicsBodyType = Phaser.Physics.P2JS;
}
