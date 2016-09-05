var weaponSpeed = 3000,
  bulletSpeed = 170;

function Obstacle(game, player) {
  this.game = game;
  this.player = player;
  this.weapon;

  this.debug = "|ok";
}

function Weapon(game, player) {
  this.game = game;
  this.player = player;
  this.nextShot = 0;
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

  this.player.collisionGroups.bullets = this.game.physics.p2.createCollisionGroup();
}

Weapon.prototype.fire = function (from, to) {
  if (this.game.time.now < this.nextShot && this.nextShot != 0) {
        return false;
  }

  var bullet = this.bulletGroup.create(from[0], from[1], this.bulletsInfo.image);
  var bulletAngle = Phaser.Math.angleBetween(to[0],  to[1], from[0],  from[1]);
  bullet.frame = this.bulletsInfo.frame.frame1;
  //bullet.body.rotation = Phaser.Math.radToDeg(bulletAngle);
  bullet.body.rotation = bulletAngle;
  bullet.body.kinematic = true;
  bullet.body.velocity.y = -bulletSpeed * Math.sin(bulletAngle);
  bullet.body.velocity.x = -bulletSpeed * Math.cos(bulletAngle);
  bullet.body.setCollisionGroup(this.player.collisionGroups.bullets);
  bullet.body.collides(this.player.collisionGroups.torso);
  //bullet.body.collides(this.player.collisionGroups.bullets);

  this.nextShot = this.game.time.now + weaponSpeed;
}

Weapon.prototype.fireToSprite = function (from, toSprite) {
  this.fire(from,[toSprite.x, toSprite.y]);
}

Weapon.prototype.refresh = function () {
  this.bulletGroup.forEach(destoyBullet, this, true);
}

function destoyBullet (bullet) {
  if (bullet.x < 0 - bullet.height - bullet.width
    || bullet.x > gameWidth + bullet.height +bullet.width
    || bullet.y < 0 - bullet.height - bullet.width
    || bullet.y > gameHeight + bullet.height +bullet.width) {
    bullet.destroy();
  }
}
/*
function Bullet(bulletGroup) {
  var bullet = bulletGroup.create(600, getRandomNum(10, 390), 'bullets_atlas');
  bullet.frame = "bullet" + getRandomNum(1,2) + ".png";
  bullet.body.rotation = Phaser.Math.degToRad(-90);
  bullet.body.setCollisionGroup(this.player.collisionGroups.bullets);
  bullet.body.collides(this.player.collisionGroups.torso);
  //bullet.body.collides(this.player.collisionGroups.bullets);
  this.sprite = bullet;
}

function MashineGun(bulletCount) {
  var bullets = [];
  var bulletGroup = this.game.add.group();
  bulletGroup.enableBody = true;
  bulletGroup.physicsBodyType = Phaser.Physics.P2JS;

  this.player.collisionGroups.bullets = this.game.physics.p2.createCollisionGroup();
  //AFTER CREATING COLLISION GROUPS IT IS IMPORTANT TO UPDATE:
  this.game.physics.p2.updateBoundsCollisionGroup();

  for (i = 0; i < bulletCount; i++) {
    var bullet = new Bullet(bulletGroup);
    bullets.push(bullet);
  }
}
*/
Obstacle.prototype.init = function () {
  //  Creates 30 bullets, using the 'bullet' graphic
  weapon = this.game.add.weapon(30, 'bullets_atlas');
  weapon.setBulletFrames(0, 1);

  //  The bullet will be automatically killed when it leaves the world bounds
  weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

  weapon.fireAngle = 180;
  weapon.bulletSpeed = 100;
  weapon.fireRate = 3000;
  weapon.autofire = true;

  weapon.x = gameWidth;
  weapon.y = gameHeight/2;

  this.weapon = weapon;

  /*
  var bullets = [];
  var bulletGroup = this.game.add.group();
  bulletGroup.enableBody = true;
  bulletGroup.physicsBodyType = Phaser.Physics.P2JS;

  this.player.collisionGroups.bullets = this.game.physics.p2.createCollisionGroup();
  //AFTER CREATING COLLISION GROUPS IT IS IMPORTANT TO UPDATE:
  this.game.physics.p2.updateBoundsCollisionGroup();

  for (var i = 0; i < 5; i++) {
    var bullet = bulletGroup.create(600, getRandomNum(10, 390), 'bullets_atlas');
    bullet.frame = "bullet" + getRandomNum(1,2) + ".png";
    bullet.body.rotation = Phaser.Math.degToRad(-90);
    bullet.body.setCollisionGroup(this.player.collisionGroups.bullets);
    bullet.body.collides(this.player.collisionGroups.torso);
    //bullet.body.collides(this.player.collisionGroups.bullets);
    bullets.push(bullet);
  }

  //var bullet = game.add.sprite(500, 200, 'bullets');
  //bullet.frame = 3;
  */
}

Obstacle.prototype.changeFireDirection = function () {
  this.weapon.fireAngle = Phaser.Math.radToDeg(Phaser.Math.angleBetween(this.weapon.x, this.weapon.y,
    this.player.playerBody.limb.torso.sprite.x, this.player.playerBody.limb.torso.sprite.y));
}
