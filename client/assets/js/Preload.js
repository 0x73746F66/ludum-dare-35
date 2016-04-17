//loading the game assets
SideScroller.Preload = function(){};
SideScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(this.preloadBar);
    //load game assets
    this.load.json('game_data', 'game_data.json');
    this.load.image('mouse', '/assets/images/mouse.png');
    this.load.image('bun', '/assets/images/bun.png');
    this.load.image('roo', '/assets/images/roo.png');
    this.load.image('cat', '/assets/images/cat.png');
    this.load.image('car', '/assets/images/car.png');
    this.load.image('fox', '/assets/images/fox.png');
    this.load.image('grass', '/assets/images/grass.png');
    this.load.image('dirt', '/assets/images/dirt.png');
    this.load.image('button', '/assets/images/button.png');
  },
  create: function() {
    this.state.start('Game');
  }
};