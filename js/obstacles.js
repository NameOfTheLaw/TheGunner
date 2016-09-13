function Weapon(game, gameMode, options) {
  var defaultOptions = {
    weaponSpeed: 1500,
    bulletSpeed: 170,
    bulletScale: 0.5
  }
  for(var option in defaultOptions) this[option] = options && options[option]!==undefined ? options[option] : defaultOptions[option];
  this.game = game;
  this.gameMode = gameMode;
  this.debug = "no hit";
  this.nextShot = 0;
  this.defaultFrom = [gameWidth, gameHeight/2];
  this.bulletsInfo = {
    image: "bullets_atlas",
    physics: "gunPhysicsData",
    scaledPhysics: "scaledGunPhysicsData",
    ammo: {
      bullet1: {
        shape: "bullet1.png",
        physics: "bullet1",
      },
      bullet2: {
        shape: "bullet2.png",
        physics: "bullet2",
      }
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
  bullet.frame = this.bulletsInfo.ammo.bullet1.shape;
  bullet.body.rotation = bulletAngle;
  bullet.body.kinematic = true;
  bullet.body.velocity.y = -this.bulletSpeed * Math.sin(bulletAngle);
  bullet.body.velocity.x = -this.bulletSpeed * Math.cos(bulletAngle);
  bullet.name = "bullet";
  bullet.scale.setTo(this.bulletScale,this.bulletScale);
  scalePolygon(this.game, this.bulletsInfo.physics, this.bulletsInfo.scaledPhysics, this.bulletsInfo.ammo.bullet1.physics, this.bulletScale);
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
}

Weapon.prototype.destoyBullet = function (bullet) {
  if (bullet.x < 0 - bullet.height - bullet.width
    || bullet.x > gameWidth + bullet.height + bullet.width
    || bullet.y < 0 - bullet.height - bullet.width
    || bullet.y > gameHeight + bullet.height +bullet.width) {
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
