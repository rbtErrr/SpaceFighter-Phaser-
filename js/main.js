// if it exist USE it || create a new object
var SpaceFighter = SpaceFighter || {};

SpaceFighter.game = new Phaser.Game('100%', '100%', Phaser.AUTO);

SpaceFighter.game.state.add('GameState', SpaceFighter.GameState);
SpaceFighter.game.state.start('GameState');