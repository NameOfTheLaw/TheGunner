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

  //angle limits for bodyParts
  var headAngleLimits = [Phaser.Math.degToRad(-10), Phaser.Math.degToRad(10)],
    shoulderAngleLimits = [Phaser.Math.degToRad(-40), Phaser.Math.degToRad(140)];

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
  //ltshoulder.body.collides(handsCollisionGroup);

  rtshoulder = bodyParts.create(150, 200, 'player_atlas');
  rtshoulder.frameName = 'shoulder.png';
  rtshoulder.body.clearShapes();
	rtshoulder.body.loadPolygon('physicsData', 'shoulder');
  rtshoulder.body.setCollisionGroup(handsCollisionGroup);
  //rtshoulder.body.collides(handsCollisionGroup);

  head = bodyParts.create(150, 20, 'player_atlas');
  head.frameName = 'head.png';
  head.body.clearShapes();
  head.body.loadPolygon('physicsData', 'head');
  head.body.setCollisionGroup(headCollisionGroup);
  //head.body.collides(torsoCollisionGroup);

  ltbutt = bodyParts.create(150, 400, 'player_atlas');
  ltbutt.frameName = 'butt.png';
  ltbutt.body.clearShapes();
  ltbutt.body.loadPolygon('physicsData', 'butt');
  ltbutt.body.setCollisionGroup(legsCollisionGroup);
  //ltbutt.body.collides(torsoCollisionGroup);

  rtbutt = bodyParts.create(150, 400, 'player_atlas');
  rtbutt.frameName = 'butt.png';
  rtbutt.body.clearShapes();
  rtbutt.body.loadPolygon('physicsData', 'butt');
  rtbutt.body.setCollisionGroup(legsCollisionGroup);
  //rtbutt.body.collides(torsoCollisionGroup);

  //connect torso to left shoulder and limiting rotation angle
  //this.game.physics.p2.createDistanceConstraint(torso, ltshoulder, 0, [0, -torso.height/2 + 20], [0, -ltshoulder.height/2 + 10]);
  var constr1 = this.game.physics.p2.createRevoluteConstraint(torso, [0, - torso.height/2 + 20], ltshoulder, [0, -ltshoulder.height/2 + 10]);
  //limit the angle of rotation
  constr1.setLimits(shoulderAngleLimits[0], shoulderAngleLimits[1]);
  //connect torso to right shoulder and limiting rotation angle
  //this.game.physics.p2.createDistanceConstraint(torso, rtshoulder, 0, [0, -torso.height/2 + 20], [0, -rtshoulder.height/2 + 10]);
  var constr2 = this.game.physics.p2.createRevoluteConstraint(torso, [0, - torso.height/2 + 20], rtshoulder, [0, -rtshoulder.height/2 + 10]);
  //limit the angle of rotation
  constr2.setLimits(shoulderAngleLimits[0], shoulderAngleLimits[1]);
  //connect torso to ltbutt
  this.game.physics.p2.createDistanceConstraint(torso, ltbutt, 0, [0, torso.height/2 - 20], [0, -ltbutt.height/2 + 10]);
  //connect torso to rtbutt
  this.game.physics.p2.createDistanceConstraint(torso, rtbutt, 0, [0, torso.height/2 - 20], [0, -rtbutt.height/2 + 10]);

  //connect torso to head (WITHOUT NECK NOW) and limiting rotation angle
  var constr3 = this.game.physics.p2.createRevoluteConstraint(torso, [0, - torso.height/2 ], head, [0, head.height/2 + 7]);
  constr3.setLimits(headAngleLimits[0], headAngleLimits[1]);

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
