(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by jorge.graca on 10/10/2015.
 */

var MAX_LENGTH = 850; // pixels
var TOTAL = 2000; //ms
var FADE_TIME = 200; //ms
var BEAM_SPEED_START = 1800;
var FIRE_TIME = 100;//ms

var Beam = function(game, myCollisionGroup) {
    Phaser.Sprite.call(this, game, 0, 0, 'beam');
    this.anchor.set(0.5, 0.5);//BECAUSE P2JS this is always true
    this.scale.setTo(0, 1);

    this.alphaTween = this.game.add.tween(this).to({alpha: 0.1}, FADE_TIME, null, false, TOTAL - FADE_TIME);
    this.alphaTween.onComplete.add(function(){
        this.kill();
    }, this);

    this.sizeTween = this.game.add.tween(this).to({width: MAX_LENGTH}, TOTAL - FADE_TIME, 'Expo');
    this.sizeTween.onComplete.add(function(){
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }, this);
    this.glowTween = this.game.add.tween(this.scale).to({y: 2}, 200, null, null, 50, -1, true);


    this.game.physics.p2.enable(this, debug);

    this.body.velocity.x = Math.cos(this.rotation) * BEAM_SPEED_START;
    this.body.velocity.y = Math.sin(this.rotation) * BEAM_SPEED_START;
    this.velocityTween = this.game.add.tween(this.body.velocity).to({
        x : 0,// Math.cos(this.rotation) * BEAM_SPEED_END,
        y : 0 //Math.sin(this.rotation) * BEAM_SPEED_END
    }, TOTAL - FADE_TIME,  'Expo', false, 0);

    this.kill();

    this.body.fixedRotation = true;
    this.myCollisionGroup = myCollisionGroup;
    this.body.setRectangleFromSprite(this);
    this.body.setCollisionGroup(myCollisionGroup);
    this.body.kinematic = true;
    //this.body.damping= 0;
    //this.body.mass= 0.1;
}

Beam.prototype = Object.create(Phaser.Sprite.prototype);

Beam.prototype.update = function() {
    Phaser.Sprite.prototype.update.call(this);

    //this.body.setZeroVelocity();
    this.body.setRectangleFromSprite(this);
    this.body.setCollisionGroup(this.myCollisionGroup);
};


Beam.prototype.shoot = function(x,y) {
    // Revive the bullet
    // This makes the bullet "alive"
    this.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    this.body.collideWorldBounds = false;//p2
    this.checkWorldBounds = false;//arcade
    //this.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    this.reset(x, y);
    this.alpha = 1;
    this.scale.setTo(0, 1);

    this.sizeTween.start();
    this.alphaTween.start();
    this.glowTween.start();
    // Aim the gun at the pointer.
    // All this function does is calculate the angle using
    // Math.atan2(yPointer-yGun, xPointer-xGun)
    this.rotation = this.game.physics.arcade.angleToPointer(this);

    this.body.velocity.x = Math.cos(this.rotation) * BEAM_SPEED_START;
    this.body.velocity.y = Math.sin(this.rotation) * BEAM_SPEED_START;
    this.velocityTween.start();
    //game.time.events.add(Phaser.Timer.QUARTER, function(){
    //    this.body.velocity.x = Math.cos(this.rotation) * BEAM_SPEED_START;
    //    this.body.velocity.y = Math.sin(this.rotation) * BEAM_SPEED_START;
    //    this.velocityTween.start();
    //}, this).autoDestroy = true;


};

Beam.prototype.constructor = Beam;

module.exports = Beam;
},{}],2:[function(require,module,exports){
/**
 * Created by jorge.graca on 10/10/2015.
 */

var BULLET_SPEED = 500; // pixels/second

var Explosion = function(game, x, y) {
    Phaser.Group.call(this, game);

    this.explosion = this.create(x, y, 'explosion');
    this.explosion.anchor.setTo(0.5, 0.5);
    this.explosion.kill();

    // Add an animation for the explosion that kills the sprite when the
    // animation is complete
    this.explosionAnim = this.explosion.animations.add('boom', [0, 1, 2, 3], 50, false);
    this.explosionAnim.killOnComplete = true;
}

Explosion.prototype = Object.create(Phaser.Group.prototype);

//Explosion.prototype.update = function() {
//    Phaser.Group.prototype.update.call(this);
//};

Explosion.prototype.boom = function(x,y) {
    this.explosion.x = x;
    this.explosion.y = y;

    this.explosion.revive();
    // Set rotation of the explosion at random for a little variety
    this.explosion.angle = this.game.rnd.integerInRange(0, 360);
    // Play the animation
    this.explosion.animations.play('boom');
};

Explosion.prototype.constructor = Explosion;

module.exports = Explosion;
},{}],3:[function(require,module,exports){
/**
 * Created by jorge.graca on 10/10/2015.
 */

var BULLET_SPEED = 500; // pixels/second

var Projectile = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'BalaPotassio');

    this.game.physics.p2.enable(this, debug);
    this.body.setCircle(this.width/2);
    this.body.fixedRotation = true;


    this.anchor.set(0.5, 0.5);
    this.kill();
}

Projectile.prototype = Object.create(Phaser.Sprite.prototype);

//Projectile.prototype.update = function() {
//    Phaser.Sprite.prototype.update.call(this);
//};

Projectile.prototype.shootBullet = function(x,y) {
    // Revive the bullet
    // This makes the bullet "alive"
    this.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    this.body.collideWorldBounds = false;//p2
    this.checkWorldBounds = true;//arcade
    this.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    this.reset(x, y);

    // Aim the gun at the pointer.
    // All this function does is calculate the angle using
    // Math.atan2(yPointer-yGun, xPointer-xGun)
    this.rotation = this.game.physics.arcade.angleToPointer(this);

    // Shoot it
    this.body.velocity.x = Math.cos(this.rotation) * BULLET_SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * BULLET_SPEED;
};

Projectile.prototype.constructor = Projectile;

module.exports = Projectile;
},{}],4:[function(require,module,exports){
/**
 * Created by jorge.graca on 10/10/2015.
 */
var Projectile = require('..\\common\\Projectile');

var NUMBER_OF_BULLETS = 50;

var ProjectilePool = function(game, bulletCollisionGroup, collisionArr){
    this.bulletPool = game.add.group();
    this.iBullet = 0;

    this.bulletPool.enableBody = true;
    this.bulletPool.physicsBodyType = Phaser.Physics.P2JS;

    for(var i = 0; i < NUMBER_OF_BULLETS; i++) {
        var tempP = new Projectile(game, 0, 0);

        tempP.body.setCollisionGroup(bulletCollisionGroup);
        tempP.body.collides(collisionArr);
        this.bulletPool.add(tempP);
    }
};

ProjectilePool.prototype.shoot = function(x,y) {
    this.bulletPool.children[this.iBullet++%NUMBER_OF_BULLETS].shootBullet(x,y);
};

module.exports = ProjectilePool;
},{"..\\common\\Projectile":3}],5:[function(require,module,exports){
"use strict";

window.game = new Phaser.Game(1200, 600, Phaser.AUTO);

game.globals = {
    //Add variables here that you want to access globally
    //score: 0 could be accessed as game.globals.score for example
};

game.state.add('play', require('./states/play.js'));
game.state.add('load', require('./states/load.js'));
game.state.add('menu', require('./states/menu.js'));
game.state.add('boot', require('./states/boot.js'));

game.state.start('boot');

window.debug = false;
},{"./states/boot.js":6,"./states/load.js":7,"./states/menu.js":8,"./states/play.js":9}],6:[function(require,module,exports){
module.exports = {
    init: function () {
        //Add here your scaling options
    },

    preload: function () {
        //Load just the essential files for the loading screen,
        //they will be used in the Load State
        game.load.image('loading', 'assets/loading.png');
        game.load.image('load_progress_bar', 'assets/progress_bar_bg.png');
        game.load.image('load_progress_bar_dark', 'assets/progress_bar_fg.png');
    },

    create: function () {
        if(debug){
            game.plugins.add(Phaser.Plugin.Inspector);
        }


        game.state.start('load');
    }
};
},{}],7:[function(require,module,exports){
module.exports = {
    loadingLabel: function () {
        //Here we add a label to let the user know we are loading everything
        //This is the "Loading" phrase in pixel art
        //You can just as easily change it for your own art :)
        this.loading = game.add.sprite(game.world.centerX, game.world.centerY - 20, 'loading');
        this.loading.anchor.setTo(0.5, 0.5);
        //This is the bright blue bar that is hidden by the dark bar
        this.barBg = game.add.sprite(game.world.centerX, game.world.centerY + 40, 'load_progress_bar');
        this.barBg.anchor.setTo(0.5, 0.5);
        //This bar will get cropped by the setPreloadSprite function as the game loads!
        this.bar = game.add.sprite(game.world.centerX - 192, game.world.centerY + 40, 'load_progress_bar_dark');
        this.bar.anchor.setTo(0, 0.5);
        game.load.setPreloadSprite(this.bar);
    },

    preload: function () {
        this.loadingLabel();
        //Add here all the assets that you need to game.load


        this.load.image('BalaPotassio', 'assets/bullet.png');//asynchronous
        this.load.spritesheet('explosion', 'assets/explosion.png', 128, 128);//asynchronous
        this.load.spritesheet('barbarian', 'assets/barbarian.png', 144, 144);//asynchronous
        this.load.spritesheet('scientist', 'assets/scientist.png', 144, 144);//asynchronous
        this.load.image('beam', 'assets/beam.png');//asynchronous
        this.load.image('background', 'assets/BG (2).png');//asynchronous

        this.load.audio('themeSound', 'assets/finalFaserTheme.mp3');//asynchronous
    },

    create: function () {
        game.state.start('play'); //TODO: do the menu
    }
};
},{}],8:[function(require,module,exports){
module.exports = {
    create: function(){
        //This is just like any other Phaser create function
    },
    update: function(){
        //Game logic goes here
    },
};
},{}],9:[function(require,module,exports){
var ProjectilePool = require('../common/ProjectilePool');
var Explosion = require('../common/Explosion');
var Beam = require('../common/Beam');

// Define constants
var LAZER_DELAY = 2500; //ms (0.5/sec)

module.exports = {
    create: function(){

        this.background = this.add.sprite(0, 0, 'background');
        this.themeSound = this.game.add.audio('themeSound', 0.05, true).play();

        this._scientist = this.add.sprite(300, 300, 'scientist');
        this._scientist.scale= {x:2, y:2};
        this._scientist.anchor.set(0.5, 0.5);

        this._scientist.animations.add('walk', [1, 2]);
        this._scientist.animations.add('run', [11, 12, 13, 14]);
        this._scientist.animations.add('attack', [19, 20, 21, 31, 32]);

        this.game.physics.arcade.enable(this._scientist);

        this._cursors = this.game.input.keyboard.createCursorKeys();
        this._shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

        this._isAttacking = 0;

        this.lastLazerShotAt = 0;

        this.explosion = new Explosion(this.game, 0, 0);

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.bulletCollisionGroup = game.physics.p2.createCollisionGroup();
        this.beamCollisionGroup = game.physics.p2.createCollisionGroup();
        //this.game.physics.p2.updateBoundsCollisionGroup();
        this.bulletPool = new ProjectilePool(this.game, this.bulletCollisionGroup, [this.bulletCollisionGroup, this.beamCollisionGroup]);
        this.bulletPool2 = new ProjectilePool(this.game, this.bulletCollisionGroup, [this.bulletCollisionGroup, this.beamCollisionGroup]);

        this.beam = this.add.existing(new Beam(this.game, this.beamCollisionGroup, this.bulletCollisionGroup));
        this.beam.body.collides(this.bulletCollisionGroup, function(obj1, obj2){
            // Create an explosion
            this.explosion.boom(obj2.x, obj2.y);

            // Kill the bullet
            obj2.sprite.kill();
        }, this);
    },
    update: function(){

        // Shoot a bullet
        if (this.game.input.activePointer.isDown) {
            if (!this._isAttacking) {
                //others have magic mike
                //we have magic numbers
                this._isAttacking = 15;
            }
        }

        this._scientist.body.velocity.x = 0;
        this._scientist.body.velocity.y = 0;

        if (this._isAttacking) {
            //others have magic mike
            //we have magic numbers
            if (this.game.time.now - this.lastLazerShotAt > LAZER_DELAY) {
                this._scientist.animations.play('attack', 10);
            }
        } else if (this._cursors.left.isDown || this._cursors.right.isDown || this._cursors.up.isDown || this._cursors.down.isDown) {
            this._scientist.animations.play(this._shift.isDown ? 'run' : 'walk', 30, true);
        } else {
            this._scientist.animations.stop('walk');
            this._scientist.animations.stop('run');
            this._scientist.frame = 0;
        }

        if (this._isAttacking && this._isAttacking--) {
            //others have magic mike
            //we have magic numbers
            if (this._isAttacking === 8) {
                //this.bulletPool.shoot(this._scientist.x + 60, this._scientist.y - 15);
                this.bulletPool2.shoot(600, 600);
            }

            if (this.game.time.now - this.lastLazerShotAt > LAZER_DELAY) {
                this.lastLazerShotAt = this.game.time.now;
                this.beam.shoot(this._scientist.x, this._scientist.y);
            }
        }

        var speedModifier = this._shift.isDown ? 2 : 1;

        if (this._cursors.left.isDown) {
            this._scientist.body.velocity.x = speedModifier * -200;
        } else if (this._cursors.right.isDown) {
            this._scientist.body.velocity.x = speedModifier * 200;
        }

        if (this._cursors.up.isDown) {
            this._scientist.body.velocity.y = speedModifier * -200;
        } else if (this._cursors.down.isDown) {
            this._scientist.body.velocity.y = speedModifier * 200;
        }
    }
};
},{"../common/Beam":1,"../common/Explosion":2,"../common/ProjectilePool":4}]},{},[5])


//# sourceMappingURL=main.js.map
