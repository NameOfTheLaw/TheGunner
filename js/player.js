function Player(game) {
  this.game = game;
  this.torso = null;
  this.ltshoulder = null;
  this.rtshoulder = null;
  this.head = null;
  this.ltbutt = null;
  this.rtbutt = null;
}

Player.prototype.init = function () {

  //angle limits for bodyParts to rotate around constraints
  var headAngleLimits = [Phaser.Math.degToRad(-10), Phaser.Math.degToRad(10)],
    shoulderAngleLimits = [Phaser.Math.degToRad(-140), Phaser.Math.degToRad(40)],
    buttAngleLimits = [Phaser.Math.degToRad(-90), Phaser.Math.degToRad(90)],
    shinAngleLimits = [Phaser.Math.degToRad(-20), Phaser.Math.degToRad(90)],
    ankleAngleLimits = [Phaser.Math.degToRad(-20), Phaser.Math.degToRad(40)],
    handAngleLimits = [Phaser.Math.degToRad(-140), Phaser.Math.degToRad(0)];

  var torsoCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var handsCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var headCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var legsCollisionGroup = this.game.physics.p2.createCollisionGroup();
  this.game.physics.p2.updateBoundsCollisionGroup(); //mb comment

  var bodyParts, torso, lthand, rthand, ltshoulder, rtshoulder, head;

  bodyParts = this.game.add.group();
  bodyParts.enableBody = true;
  bodyParts.physicsBodyType = Phaser.Physics.P2JS;

  torso = bodyParts.create(150, 200, 'player_atlas');
  torso.frameName = 'torso.png';
  torso.body.anchor = [0.5, 0.1];
  torso.body.clearShapes();
	torso.body.loadPolygon('physicsData', 'torso');
  torso.body.setCollisionGroup(torsoCollisionGroup);
  torso.body.collides(headCollisionGroup);

  ltshoulder = bodyParts.create(150, 200, 'player_atlas');
  ltshoulder.frameName = 'shoulder.png';
  ltshoulder.body.clearShapes();
	ltshoulder.body.loadPolygon('physicsData', 'shoulder');
  ltshoulder.body.setCollisionGroup(handsCollisionGroup);

  rtshoulder = bodyParts.create(150, 200, 'player_atlas');
  rtshoulder.frameName = 'shoulder.png';
  rtshoulder.body.clearShapes();
	rtshoulder.body.loadPolygon('physicsData', 'shoulder');
  rtshoulder.body.setCollisionGroup(handsCollisionGroup);

  rthand = bodyParts.create(150, 200, 'player_atlas');
  rthand.frameName = 'hand.png';
  rthand.body.clearShapes();
	rthand.body.loadPolygon('physicsData', 'hand');
  rthand.body.setCollisionGroup(handsCollisionGroup);

  lthand = bodyParts.create(150, 200, 'player_atlas');
  lthand.frameName = 'hand.png';
  lthand.body.clearShapes();
	lthand.body.loadPolygon('physicsData', 'hand');
  lthand.body.setCollisionGroup(handsCollisionGroup);

  head = bodyParts.create(150, 20, 'player_atlas');
  head.frameName = 'head.png';
  head.body.clearShapes();
  head.body.loadPolygon('physicsData', 'head');
  head.body.setCollisionGroup(headCollisionGroup);
  head.body.collides(torsoCollisionGroup);

  ltbutt = bodyParts.create(150, 400, 'player_atlas');
  ltbutt.frameName = 'butt.png';
  ltbutt.body.clearShapes();
  ltbutt.body.loadPolygon('physicsData', 'butt');
  ltbutt.body.setCollisionGroup(legsCollisionGroup);

  rtbutt = bodyParts.create(150, 400, 'player_atlas');
  rtbutt.frameName = 'butt.png';
  rtbutt.body.clearShapes();
  rtbutt.body.loadPolygon('physicsData', 'butt');
  rtbutt.body.setCollisionGroup(legsCollisionGroup);

  rtshin = bodyParts.create(150, 400, 'player_atlas');
  rtshin.frameName = 'shin.png';
  rtshin.body.clearShapes();
  rtshin.body.loadPolygon('physicsData', 'shin');
  rtshin.body.setCollisionGroup(legsCollisionGroup);

  ltshin = bodyParts.create(150, 400, 'player_atlas');
  ltshin.frameName = 'shin.png';
  ltshin.body.clearShapes();
  ltshin.body.loadPolygon('physicsData', 'shin');
  ltshin.body.setCollisionGroup(legsCollisionGroup);

  ltankle = bodyParts.create(150, 400, 'player_atlas');
  ltankle.frameName = 'ankle.png';
  ltankle.body.clearShapes();
  ltankle.body.loadPolygon('physicsData', 'ankle');
  ltankle.body.setCollisionGroup(legsCollisionGroup);

  rtankle = bodyParts.create(150, 400, 'player_atlas');
  rtankle.frameName = 'ankle.png';
  rtankle.body.clearShapes();
  rtankle.body.loadPolygon('physicsData', 'ankle');
  rtankle.body.setCollisionGroup(legsCollisionGroup);

  //bodyParts.forEach(testA, this, true, 50);

  //connections
  createBodyConstraint(this.game, torso, [0, - torso.height/2 + 20], ltshoulder, [0, -ltshoulder.height/2 + 10], shoulderAngleLimits);
  createBodyConstraint(this.game, torso, [0, - torso.height/2 + 20], rtshoulder, [0, -rtshoulder.height/2 + 10], shoulderAngleLimits);
  createBodyConstraint(this.game, torso, [0, torso.height/2 - 20], ltbutt, [0, -ltbutt.height/2 + 10], buttAngleLimits);
  createBodyConstraint(this.game, torso, [0, torso.height/2 - 20], rtbutt, [0, -rtbutt.height/2 + 10], buttAngleLimits);
  createBodyConstraint(this.game, torso, [0, - torso.height/2 ], head, [0, head.height/2 + 7], headAngleLimits);
  createBodyConstraint(this.game, rtbutt, [0, rtbutt.height/2 - 10], rtshin, [0, -rtshin.height/2 + 10], shinAngleLimits);
  createBodyConstraint(this.game, ltbutt, [0, ltbutt.height/2 - 10], ltshin, [0, -ltshin.height/2 + 10], shinAngleLimits);
  createBodyConstraint(this.game, ltshin, [0, ltshin.height/2 - 5], ltankle, [- ltankle.width/2 + 10, -ltankle.height/2 + 5], ankleAngleLimits);
  createBodyConstraint(this.game, rtshin, [0, rtshin.height/2 - 5], rtankle, [- rtankle.width/2 + 10, -rtankle.height/2 + 5], ankleAngleLimits);
  createBodyConstraint(this.game, ltshoulder, [0, ltshoulder.height/2 - 10], lthand, [0, -lthand.height/2 + 10], handAngleLimits);
  createBodyConstraint(this.game, rtshoulder, [0, rtshoulder.height/2 - 10], rthand, [0, -rthand.height/2 + 10], handAngleLimits);

  this.torso = torso;
  this.ltshoulder = ltshoulder;
  this.rtshoulder = rtshoulder;
  this.head = head;
  this.ltbutt = ltbutt;
  this.rtbutt = rtbutt;
}

Player.prototype.moveLeft = function()  {
  this.torso.body.moveLeft(playerSpeed);
}

Player.prototype.moveRight = function()  {
  this.torso.body.moveRight(playerSpeed);
}

Player.prototype.moveDown = function()  {
  this.torso.body.moveDown(playerSpeed);
}

Player.prototype.moveUp = function()  {
  this.torso.body.moveUp(playerSpeed);
}

function createBodyConstraint(game, spriteA, pointA, spriteB, pointB, limitsB) {
  var constr = game.physics.p2.createRevoluteConstraint(spriteA, pointA, spriteB, pointB);
  constr.setLimits(limitsB[0], limitsB[1]);
}

function testA(child, num) {
  child.width = num;
}
