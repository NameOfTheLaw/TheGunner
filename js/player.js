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

  var playerBody = {
    image: "player_atlas",
    physics: "playerPhysicsData",
    scaledPhysics: "scaledPlayerPhysicsData",
    limb: {
      head: {
        frame: "head.png",
        physics: "head",
        collisionGroup: "head",
        collides: ["bullets", "torso"],
        damage: 40
      },
      torso: {
        frame: "torso.png",
        physics: "torso",
        collisionGroup: "torso",
        collides: ["bullets"],
        damage: 20
      },
      ltbutt: {
        frame: "butt.png",
        physics: "butt",
        collisionGroup: "legs",
        collides: ["bullets"],
        damage: 10
      },
      rtbutt: {
        frame: "butt.png",
        physics: "butt",
        collisionGroup: "legs",
        collides: ["bullets"],
        damage: 10
      },
      ltshin: {
        frame: "shin.png",
        physics: "shin",
        collisionGroup: "legs",
        collides: ["bullets"],
        damage: 10
      },
      rtshin: {
        frame: "shin.png",
        physics: "shin",
        collisionGroup: "legs",
        collides: ["bullets"],
        damage: 10
      },
      ltankle: {
        frame: "ankle.png",
        physics: "ankle",
        collisionGroup: "legs",
        collides: ["bullets"],
        damage: 5
      },
      rtankle: {
        frame: "ankle.png",
        physics: "ankle",
        collisionGroup: "legs",
        collides: ["bullets"],
        damage: 5
      },
      ltshoulder: {
        frame: "shoulder.png",
        physics: "shoulder",
        collisionGroup: "hands",
        collides: ["bullets"],
        damage: 10
      },
      rtshoulder: {
        frame: "shoulder.png",
        physics: "shoulder",
        collisionGroup: "hands",
        collides: ["bullets"],
        damage: 10
      },
      lthand: {
        frame: "hand.png",
        physics: "hand",
        collisionGroup: "hands",
        collides: ["bullets"],
        damage: 5
      },
      rthand: {
        frame: "hand.png",
        physics: "hand",
        collisionGroup: "hands",
        collides: ["bullets"],
        damage: 5
      }
    }
  }
  var bodyParts;

  bodyParts = this.game.add.group();
  bodyParts.enableBody = true;
  bodyParts.physicsBodyType = Phaser.Physics.P2JS;

  for (var num in playerBody.limb) {
    var tempSprite = bodyParts.create(100, 200, playerBody.image);
    tempSprite.frameName = playerBody.limb[num].frame;
    tempSprite.name = num;
    tempSprite.scale.setTo(this.playerScale,this.playerScale);
    scalePolygon(this.game, playerBody.physics, playerBody.scaledPhysics, playerBody.limb[num].physics, this.playerScale);
    tempSprite.body.clearShapes();
  	tempSprite.body.loadPolygon(playerBody.scaledPhysics, playerBody.limb[num].physics);
    tempSprite.body.setCollisionGroup(this.gameMode.collisionGroups[playerBody.limb[num].collisionGroup]);
    if ("collides" in playerBody.limb[num])
      for (var i in playerBody.limb[num].collides) {
        tempSprite.body.createGroupCallback(this.gameMode.collisionGroups[playerBody.limb[num].collides[i]], this.gotHit, this);
        tempSprite.body.collides(this.gameMode.collisionGroups[playerBody.limb[num].collides[i]])
      }

    playerBody.limb[num].sprite = tempSprite;
  }

  playerBody.constraint = {
    constraint1: {
      bodyA: "torso",
      pointA: [0, - playerBody.limb["torso"].sprite.height/2],
      bodyB: "head",
      pointB: [0, playerBody.limb["head"].sprite.height/2 + 7],
      lowerLimit: Phaser.Math.degToRad(-10),
      upperLimit: Phaser.Math.degToRad(10)
    },
    constraint2: {
      bodyA: "torso",
      pointA: [0, - playerBody.limb["torso"].sprite.height/2 + 20],
      bodyB: "ltshoulder",
      pointB: [0, -playerBody.limb["ltshoulder"].sprite.height/2 + 10],
      lowerLimit: Phaser.Math.degToRad(-140),
      upperLimit: Phaser.Math.degToRad(40)
    },
    constraint3: {
      bodyA: "torso",
      pointA: [0, - playerBody.limb["torso"].sprite.height/2 + 20],
      bodyB: "rtshoulder",
      pointB: [0, -playerBody.limb["rtshoulder"].sprite.height/2 + 10],
      lowerLimit: Phaser.Math.degToRad(-140),
      upperLimit: Phaser.Math.degToRad(40)
    },
    constraint4: {
      bodyA: "torso",
      pointA: [0, playerBody.limb["torso"].sprite.height/2 - 20],
      bodyB: "rtbutt",
      pointB: [0, -playerBody.limb["rtbutt"].sprite.height/2 + 10],
      lowerLimit: Phaser.Math.degToRad(-90),
      upperLimit: Phaser.Math.degToRad(90)
    },
    constraint5: {
      bodyA: "torso",
      pointA: [0, playerBody.limb["torso"].sprite.height/2 - 20],
      bodyB: "ltbutt",
      pointB: [0, -playerBody.limb["ltbutt"].sprite.height/2 + 10],
      lowerLimit: Phaser.Math.degToRad(-90),
      upperLimit: Phaser.Math.degToRad(90)
    },
    constraint6: {
      bodyA: "ltshoulder",
      pointA: [0, playerBody.limb["ltshoulder"].sprite.height/2 - 10],
      bodyB: "lthand",
      pointB: [0, -playerBody.limb["lthand"].sprite.height/2 + 10],
      lowerLimit: Phaser.Math.degToRad(-140),
      upperLimit: Phaser.Math.degToRad(0)
    },
    constraint7: {
      bodyA: "rtshoulder",
      pointA: [0, playerBody.limb["rtshoulder"].sprite.height/2 - 10],
      bodyB: "rthand",
      pointB: [0, -playerBody.limb["rthand"].sprite.height/2 + 10],
      lowerLimit: Phaser.Math.degToRad(-140),
      upperLimit: Phaser.Math.degToRad(0)
    },
    constraint8: {
      bodyA: "rtbutt",
      pointA: [0, playerBody.limb["rtbutt"].sprite.height/2 - 10],
      bodyB: "rtshin",
      pointB: [0, -playerBody.limb["rtshin"].sprite.height/2 + 10],
      lowerLimit: Phaser.Math.degToRad(-20),
      upperLimit: Phaser.Math.degToRad(90)
    },
    constraint9: {
      bodyA: "ltbutt",
      pointA: [0, playerBody.limb["ltbutt"].sprite.height/2 - 10],
      bodyB: "ltshin",
      pointB: [0, -playerBody.limb["ltshin"].sprite.height/2 + 10],
      lowerLimit: Phaser.Math.degToRad(-20),
      upperLimit: Phaser.Math.degToRad(90)
    },
    constraint10: {
      bodyA: "ltshin",
      pointA: [0, playerBody.limb["ltshin"].sprite.height/2 - 5],
      bodyB: "ltankle",
      pointB: [- playerBody.limb["ltankle"].sprite.width/2 + 10, -playerBody.limb["ltankle"].sprite.height/2 + 5],
      lowerLimit: Phaser.Math.degToRad(-20),
      upperLimit: Phaser.Math.degToRad(40)
    },
    constraint11: {
      bodyA: "rtshin",
      pointA: [0, playerBody.limb["rtshin"].sprite.height/2 - 5],
      bodyB: "rtankle",
      pointB: [- playerBody.limb["rtankle"].sprite.width/2 + 10, -playerBody.limb["rtankle"].sprite.height/2 + 5],
      lowerLimit: Phaser.Math.degToRad(-20),
      upperLimit: Phaser.Math.degToRad(40)
    }
  }

  for (var num in playerBody.constraint) {
    var element = playerBody.constraint[num];
    var constraint = createBodyConstraint(
      this.game,
      playerBody.limb[element.bodyA].sprite,
      element.pointA,
      playerBody.limb[element.bodyB].sprite,
      element.pointB,
      [element.lowerLimit, element.upperLimit]
    );
    this.playerConstraints.push(constraint);
  }

  this.playerBody = playerBody;
  this.bodyParts = bodyParts;
}

Player.prototype.moveLeft = function()  {
  this.playerBody.limb.torso.sprite.body.moveLeft(this.playerSpeed);
}

Player.prototype.moveRight = function()  {
  this.playerBody.limb.torso.sprite.body.moveRight(this.playerSpeed);
}

Player.prototype.moveDown = function()  {
  this.playerBody.limb.torso.sprite.body.moveDown(this.playerSpeed);
}

Player.prototype.moveUp = function()  {
  this.playerBody.limb.torso.sprite.body.moveUp(this.playerSpeed);
}

Player.prototype.atttendHealth = function(health) {
  this.health = health;
}

Player.prototype.gotHit = function (body1, body2) {
  if (body1.sprite.name == "head")
    this.game.camera.shake(0.01, 300)
  else
    this.game.camera.shake(0.001, 300);
  //TODO: баг, при которой одна пуля дамажит дважды. Можно решить добавлением
  //продамаживших пуль в стек с последующей проверкой новых попаданий на повторы.
  this.health.damage(this.playerBody.limb[body1.sprite.name].damage);
  body2.sprite.kill();
  //debug = "hit in " + body1.sprite.name + " (-" + this.playerBody.limb[body1.sprite.name].damage + ")";
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
  this.playerBody.limb.torso.sprite.x = 100;
  this.playerBody.limb.torso.sprite.y = 200;
  this.health.refresh();
}
