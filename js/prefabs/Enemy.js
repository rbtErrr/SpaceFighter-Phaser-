var SpaceFighter = SpaceFighter || {};

SpaceFighter.Enemy = function (game, x, y, key, health, speedX, speedY, enemyBullets) {
    Phaser.Sprite.call(this, game, x, y, key);
    // this.animations.game.add.tween(this);
    this.game = game;
    this.game.physics.arcade.enable(this);

    this.anchor.setTo(0.5);
    this.scale.setTo(0.7);
    this.health = health;
    // this.animation = this.game.add.tween(this);
    // this.animation.from({alpha: 0.5}, 100);
    // this.animation.to({alpha: 1}, 100);


    this.enemyBullets = enemyBullets;
    // this.shootingTimerEnemy = this.game.time.events.loop(Phaser.Timer.SECOND/5, this.createEnemyBullet, this);

    // //false in param means that timer will not self destroy after creation bullet
    this.body.velocity.x = this.speedX;
    this.body.velocity.y = this.speedY;
    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();

    this.scheduleShooting();



    //
    // //schedule - график
    // this.scheduleShooting();

};

SpaceFighter.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
SpaceFighter.Enemy.prototype.constructor = SpaceFighter.Enemy;

// add update method
SpaceFighter.Enemy.prototype.update = function () {
    if (this.x < 0.05 * this.game.world.width) {
        this.x = 0.05 * this.game.world.width + 2;
        this.body.velocity.x *= -1;
    } else if (this.x > 0.95 * this.game.world.width) {
        this.x = 0.95 * this.game.world.width - 2;
        this.body.velocity.x *= -1;
    }

    if (this.top > this.game.world.height) {
        this.kill();
    }

};

SpaceFighter.Enemy.prototype.damage = function (amount) {
    Phaser.Sprite.prototype.damage.call(this, amount);
    // this.animation.start();
    // this.animation.repeat(2, 200);

//    particle explosion
    if (this.health <= 0) {
        var emitter = this.game.add.emitter(this.x, this.y, 20);
        emitter.makeParticles('enemyParticle');
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        emitter.start(true, 500, null, 20);

        this.enemyTimer.pause();
    }


};


SpaceFighter.Enemy.prototype.reset = function (x, y, health, key, scale, speedX, speedY) {
    Phaser.Sprite.prototype.reset.call(this, x, y, health);

    this.loadTexture(key);
    this.scale.setTo(scale);
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;

    this.enemyTimer.resume();


};


SpaceFighter.Enemy.prototype.createEnemyBullet = function () {
    var bullet = this.enemyBullets.getFirstExists(false);

    if (!bullet) {
        bullet = new SpaceFighter.EnemyBullet(this.game, this.x, this.bottom);
        this.enemyBullets.add(bullet);
    } else {
        // resetPosition
        bullet.reset(this.x, this.bottom);
    }

    // set velocity
    bullet.body.velocity.y = 500;

};

SpaceFighter.Enemy.prototype.scheduleShooting = function () {
    this.createEnemyBullet();


    this.enemyTimer.add(Phaser.Timer.SECOND / 3, this.scheduleShooting, this);
};
//
// SpaceFighter.Enemy.prototype.shoot = function () {
//   var bullet = this.enemyBullets.getFirstExists(false);
//
//   if(!bullet){
//       bullet = new SpaceFighter.EnemyBullet(this.game, this.x, this.bottom);
//       this.enemyBullets.add(bullet);
//   }
//   else{
//       bullet.reset(this.x, this.y);
//   }
//
//   bullet.body.velocity.y = 100;
// };