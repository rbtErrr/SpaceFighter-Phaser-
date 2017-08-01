var SpaceFighter = SpaceFighter || {};

// create class PlayerBullet
SpaceFighter.PlayerBullet = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    this.anchor.setTo(0.5);
    this.scale.setTo(0.7);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};

// inheritence of sprite prototype. Create custom class
SpaceFighter.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
//!!!!
SpaceFighter.PlayerBullet.prototype.constructor = SpaceFighter.PlayerBullet;