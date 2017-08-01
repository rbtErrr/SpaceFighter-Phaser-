var SpaceFighter = SpaceFighter || {};

SpaceFighter.EnemyBullet = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');

    this.anchor.setTo(0.5);
    this.scale.setTo(0.7);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

};

SpaceFighter.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceFighter.EnemyBullet.prototype.constructor = SpaceFighter.EnemyBullet;