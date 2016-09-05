var mashineGunSpeed = 200;

function Obstacle(game, player) {
  this.game = game;
  this.player = player;
  this.weapon;

  this.debug = "|ok";
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
