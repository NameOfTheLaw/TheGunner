function Player(game, gameMode) {
  this.game = game;
  this.gameMode = gameMode;
  this.playerSpeed = 200;
  this.playerBody = {};
  this.collisionGroups = {};
}

Player.prototype.init = function () {

  var playerBody = {
    image: "player_atlas",
    physics: "playerPhysicsData",
    limb: {
      head: {
        frame: "head.png",
        physics: "head",
        collisionGroup: "head",
        collides: ["bullets", "torso"]
      },
      torso: {
        frame: "torso.png",
        physics: "torso",
        collisionGroup: "torso",
        collides: ["bullets"]
      },
      ltbutt: {
        frame: "butt.png",
        physics: "butt",
        collisionGroup: "legs",
        collides: ["bullets"]
      },
      rtbutt: {
        frame: "butt.png",
        physics: "butt",
        collisionGroup: "legs",
        collides: ["bullets"]
      },
      ltshin: {
        frame: "shin.png",
        physics: "shin",
        collisionGroup: "legs",
        collides: ["bullets"]
      },
      rtshin: {
        frame: "shin.png",
        physics: "shin",
        collisionGroup: "legs",
        collides: ["bullets"]
      },
      ltankle: {
        frame: "ankle.png",
        physics: "ankle",
        collisionGroup: "legs",
        collides: ["bullets"]
      },
      rtankle: {
        frame: "ankle.png",
        physics: "ankle",
        collisionGroup: "legs",
        collides: ["bullets"]
      },
      ltshoulder: {
        frame: "shoulder.png",
        physics: "shoulder",
        collisionGroup: "hands",
        collides: ["bullets"]
      },
      rtshoulder: {
        frame: "shoulder.png",
        physics: "shoulder",
        collisionGroup: "hands",
        collides: ["bullets"]
      },
      lthand: {
        frame: "hand.png",
        physics: "hand",
        collisionGroup: "hands",
        collides: ["bullets"]
      },
      rthand: {
        frame: "hand.png",
        physics: "hand",
        collisionGroup: "hands",
        collides: ["bullets"]
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
    tempSprite.body.clearShapes();
  	tempSprite.body.loadPolygon(playerBody.physics, playerBody.limb[num].physics);
    tempSprite.body.setCollisionGroup(this.gameMode.collisionGroups[playerBody.limb[num].collisionGroup]);
    if ("collides" in playerBody.limb[num])
      for (var i in playerBody.limb[num].collides) tempSprite.body.collides(this.gameMode.collisionGroups[playerBody.limb[num].collides[i]]);
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
    createBodyConstraint(this.game, playerBody.limb[element.bodyA].sprite, element.pointA, playerBody.limb[element.bodyB].sprite, element.pointB, [element.lowerLimit, element.upperLimit]);
  }

  this.playerBody = playerBody;
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

function createBodyConstraint(game, spriteA, pointA, spriteB, pointB, limitsB) {
  var constraint = game.physics.p2.createRevoluteConstraint(spriteA, pointA, spriteB, pointB);
  if (limitsB) constraint.setLimits(limitsB[0], limitsB[1]);
}
