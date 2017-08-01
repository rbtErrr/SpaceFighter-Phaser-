// if it exist USE it || create a new object
var SpaceFighter = SpaceFighter || {};

SpaceFighter.GameState = {

    init: function (currentLevel) {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -1000;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.numLevels = 3;
        this.currentLevel = currentLevel ? currentLevel : 1;
        // this.currentLevel;
        // if(this.currentLevel){
        //     this.currentLevel = this.currentLevel;
        // }else{
        //     this.currentLevel = 1;
        // }
        console.log(this.currentLevel);
    },

    preload: function () {
        this.load.image('space', 'assets/images/purple.png');
        this.load.image('player', 'assets/images/playerShip1_blue.png');
        this.load.image('bullet', 'assets/images/laserBlue02.png');
        this.load.image('enemyParticle', 'assets/images/particle.png');
        this.load.image('blackEnemy', 'assets/images/enemyBlack4.png');
        this.load.image('redEnemy', 'assets/images/enemyRed4.png');
        this.load.image('greenEnemy', 'assets/images/enemyGreen1.png');

    //    load level data
        this.load.text('level1', 'assets/data/level1.json');
        this.load.text('level2', 'assets/data/level2.json');
        this.load.text('level3', 'assets/data/level3.json');

    },

    create: function () {
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
        //    moving background
        this.background.autoScroll(0, 30);


        //    add player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 50, 'player');
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(0.8);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;


        //    init pool of objects(bullets)
        this.initBullets();
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 5, this.createPlayerBullet, this);

        //to create object use method existing
        // this.game.add.existing(enemy);
        this.initEnemies();


        //    load level
        this.loadLevel();

    },

    update: function () {
        this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);

        this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null, this);

        //!!!!! always, because player will move forever
        this.player.body.velocity.x = 0;

        // create touchscreen controls
        if (this.game.input.activePointer.isDown) {
            var targetX = this.game.input.activePointer.position.x;

            var direction = targetX >= this.game.world.centerX ? 1 : -1;
            this.player.body.velocity.x = direction * this.PLAYER_SPEED;
        }

        // create cursors controls
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= this.PLAYER_SPEED;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += this.PLAYER_SPEED;
        }
    },

    initBullets: function () {
        this.playerBullets = this.game.add.group();
        this.playerBullets.enableBody = true;
    },

    createPlayerBullet: function () {
        var bullet = this.playerBullets.getFirstExists(false);

        if (!bullet) {
            bullet = new SpaceFighter.PlayerBullet(this.game, this.player.position.x, this.player.position.top);
            this.playerBullets.add(bullet);
        } else {
            // resetPosition
            bullet.reset(this.player.x, this.player.top);
        }

        // set velocity
        bullet.body.velocity.y = this.BULLET_SPEED;
    },

    initEnemies: function () {
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;

        this.enemyBullets = this.game.add.group();
        this.enemyBullets.enableBody = true;

        // this.enemy = new SpaceFighter.Enemy(this.game, 100, 100, 'greenEnemy', 10, this.enemyBullets);
        // this.enemies.add(this.enemy);
        //
        // this.enemy.body.velocity.x = 100;
        // this.enemy.body.velocity.y = 50;
    },

    damageEnemy: function (bullet, enemy) {

        //health and damage in sprite by default. Damage take health from obj
        enemy.damage(1);

        bullet.kill();

        // self = this;
        // var timer = setInterval(function () {
        //     self.enemy.reset(100, 100, 20, 'redEnemy', 2, 100, 100);
        // }, 3000);

    },

    killPlayer: function () {
        this.player.kill();

        this.game.state.start('GameState');
    },

    createEnemy: function (x, y, health, key, scale, speedX, speedY) {
        var enemy = this.enemies.getFirstExists(false);

        if (!enemy) {
            enemy = new SpaceFighter.Enemy(this.game, x, y, key, health, speedX, speedY, this.enemyBullets);
            this.enemies.add(enemy);
        }

        enemy.reset(x, y, health, key, scale, speedX, speedY);
    },

    loadLevel: function () {
        this.currentEnemyIndex = 0;

        this.levelData = JSON.parse(this.game.cache.getText('level'+ this.currentLevel));
        this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000, function () {

                if(this.currentLevel < this.numLevels){
                    this.currentLevel++;
                }else {
                    this.currentLevel = 1;
                }

                this.game.state.start('GameState', true, false, this.currentLevel);

        }, this);

        this.scheduleNextEnemy();

    },

    scheduleNextEnemy: function () {
        var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];

        if (nextEnemy) {
            //!!!!!
            var nextTime = 1000 * ( nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time));
            this.nextEnemyTimer = this.game.time.events.add(nextTime, function () {
                this.createEnemy(nextEnemy.x * this.game.world.width,  -100, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);

                this.currentEnemyIndex++;
                this.scheduleNextEnemy();
            }, this);
        }
    }
};