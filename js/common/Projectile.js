(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by jorge.graca on 10/10/2015.
 */

var Projectile = function(game){
    //var arcade = new Phaser.Arcade(game);

    Phaser.Group.call( this, game );

    this.coisa = this.create(300, 300, 'BalaPotassio');
    this.coisa.anchor.set(0.5,0.5);

    //player movement
    this.coisa.body.velocity.y = 0;
    this.coisa.body.velocity.x = 0;
};

Projectile.prototype = Object.create(Phaser.Group.prototype);

Projectile.prototype.update = function() {
    Phaser.Group.prototype.update.call(this);

    if(this.cursors.up.isDown) {
        this.player.body.velocity.y -= 50;
    }
    else if(this.cursors.down.isDown) {
        this.player.body.velocity.y += 50;
    }
    if(this.cursors.left.isDown) {
        this.player.body.velocity.x -= 50;
    }
    else if(this.cursors.right.isDown) {
        this.player.body.velocity.x += 50;
    }
};

Projectile.prototype.constructor = Projectile;

module.exports = Projectile;
},{}]},{},[1])


//# sourceMappingURL=Projectile.js.map
