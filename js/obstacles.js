function Weapon(game, gameMode, options) {
  var defaultOptions = {
    weaponSpeed: 3000,
    bulletSpeed: 170
  }
  for(var option in defaultOptions) this[option] = options && options[option]!==undefined ? options[option] : defaultOptions[option];
  this.game = game;
  this.gameMode = gameMode;
  this.debug = "no hit";
  this.nextShot = 0;
  this.defaultFrom = [gameWidth, gameHeight/2];
  this.bulletsInfo = {
    image: "bullets_atlas",
    frame: {
      frame1: "bullet1.png",
      frame2: "bullet2.png"
    }
  }

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
  bullet.frame = this.bulletsInfo.frame.frame1;
  //bullet.body.rotation = Phaser.Math.radToDeg(bulletAngle);
  bullet.body.rotation = bulletAngle;
  bullet.body.kinematic = true;
  bullet.body.velocity.y = -this.bulletSpeed * Math.sin(bulletAngle);
  bullet.body.velocity.x = -this.bulletSpeed * Math.cos(bulletAngle);
  bullet.body.setCollisionGroup(this.gameMode.collisionGroups.bullets);
  var weapon = this;
  for (var colGroup in this.gameMode.collisionGroups)
    if (colGroup != "bullets") {
      bullet.body.collides(this.gameMode.collisionGroups[colGroup]);
      bullet.body.createGroupCallback(this.gameMode.collisionGroups[colGroup], this.hitTheBody, this);
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
}

Weapon.prototype.destoyBullet = function (bullet) {
  if (bullet.x < 0 - bullet.height - bullet.width
    || bullet.x > gameWidth + bullet.height + bullet.width
    || bullet.y < 0 - bullet.height - bullet.width
    || bullet.y > gameHeight + bullet.height +bullet.width) {
    //bullet.destroy();
    bullet.kill();
  }
}

Weapon.prototype.hitTheBody = function (body1, body2) {
  this.debug = body2.sprite.name + " was hitted";
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
