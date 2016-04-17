SideScroller.Game = function(){};
SideScroller.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
    this.playerInFront = true;
    this.points = 0;
    this.shapeShiftBun = true;
  },
  create: function() {
    //create player from our game_data
    var playerId = this.cache.getJSON('game_data').player;

    this.dirt = this.add.tileSprite(0,this.game.height-30,this.game.world.width,30,'dirt')
    this.grass = this.add.tileSprite(0,this.game.height-100,this.game.world.width,70,'grass');
    this.generateObstacles();
    //put everything in the correct order (the grass will be camoflauge),
    //but the toy mounds have to be above that to be seen, but behind the
    //ground so they barely stick up
    this.game.world.bringToTop(this.grass);
    this.game.world.bringToTop(this.dirt);
    //enable physics on the dirt
    this.game.physics.arcade.enable(this.dirt);
    //so player can walk on ground
    this.dirt.body.immovable = true;
    this.dirt.body.allowGravity = false;

    this.createPlayer(playerId);
    //play the walking animation
    //this.player.animations.play('walk', 3, true);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    //...or by swiping
    this.swipe = this.game.input.activePointer;
        
    //stats
    var style1 = { font: "20px Arial", fill: "#ff0"};
    var t1 = this.game.add.text(10, 20, "Points:", style1);
    //var t2 = this.game.add.text(this.game.width-300, 20, "Remaining Time:", style1);
    t1.fixedToCamera = true;
    //t2.fixedToCamera = true;
 
    var style2 = { font: "26px Arial", fill: "#00ff00"};
    this.pointsText = this.game.add.text(80, 18, "", style2);
    //this.timeText = this.game.add.text(this.game.width-50, 18, "", style2);
    this.refreshStats();
    this.pointsText.fixedToCamera = true;
    //this.timeText.fixedToCamera = true;
  }, 
  createPlayer: function(playerId) {
    this.playerData = this.cache.getJSON('game_data')[playerId];
    this.player = this.game.add.sprite(10, this.game.height-50, playerId);
    //enable physics on the player
    this.game.physics.arcade.enable(this.player);
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
    //player gravity
    this.player.body.gravity.y = this.playerData.gravity;
    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
    this.game.world.bringToTop(this.player);
    this.playerInFront = true;
  }, 
  update: function() {
    this.game.world.bringToTop(this.cats);
    this.game.world.bringToTop(this.foxs);
    this.game.physics.arcade.collide(this.player, this.dirt, null, null, this);
    this.game.physics.arcade.overlap(this.player, this.cats, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.foxs, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.cars, this.playerHit, null, this);

    this.cats.filter(function(v) { return v.body.x < 0; }).callAll('destroy');
    this.foxs.filter(function(v) { return v.body.x < 0; }).callAll('destroy');
    this.cars.filter(function(v) { return v.body.x < 0; }).callAll('destroy');

    this.player.body.velocity.x = 0;
        
    var swipeCoordX, swipeCoordY, swipeCoordX2, swipeCoordY2, swipeMinDistance = 10;
    this.game.input.onDown.add(function(pointer) {
      swipeCoordX = pointer.clientX;
      swipeCoordY = pointer.clientY;
    }, this);
    var that = this;
    this.game.input.onUp.add(function(pointer) {
      swipeCoordX2 = pointer.clientX;
      swipeCoordY2 = pointer.clientY;
      if (swipeCoordX2 < swipeCoordX - swipeMinDistance) {
        that.playerStrafeL();
      } else if (swipeCoordX2 > swipeCoordX + swipeMinDistance) {
        that.playerStrafeR();
      } else if (swipeCoordY2 < swipeCoordY - swipeMinDistance) {
        that.playerJump();
      } else if (swipeCoordY2 > swipeCoordY + swipeMinDistance) {}
    }, this);
    
    if (this.cursors.up.isDown) {
      this.playerJump();
    }
    if (this.cursors.right.isDown) {
      this.playerStrafeR();
    }    
    if (this.cursors.left.isDown) {
      this.playerStrafeL();
    }
    
    if (this.shapeShiftBun && this.points > 10) {
      this.shapeShiftBun = false;
      this.player.destroy();
      this.createPlayer('bun');
      this.cats.filter(function(v) { return true; }).callAll('destroy');
      this.foxs.filter(function(v) { return true; }).callAll('destroy');
      this.cars.filter(function(v) { return true; }).callAll('destroy');
    }
    
    if (this.game.rnd.integerInRange(0, 1000) >= 990) {
      var key = this.cache.getJSON('game_data').obstacles[this.game.rnd.integerInRange(0, this.cache.getJSON('game_data').obstacles.length-1)]
      var data = this.cache.getJSON('game_data')[key];
      var x = (this.game.width) + this.game.rnd.integerInRange(0, this.game.width*2);
      var item = this[key+'s'].create(x, this.game.height-data.pos, key);
      item.body.velocity.x = parseInt('-'+data.velocity);
      item.body.immovable = true;
      item.body.collideWorldBounds = false;
      item.worth = data.points;
      item.counted = false;      
    }    
  },
  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
  },
  generateObstacles: function() {
    var numCats = this.game.rnd.integerInRange(2, 4);
    var numFoxs = this.game.rnd.integerInRange(1, 3);
    var numCars = this.game.rnd.integerInRange(0, 1);
    var cat, fox, car;
    var catData = this.cache.getJSON('game_data').cat;
    var foxData = this.cache.getJSON('game_data').fox;
    var carData = this.cache.getJSON('game_data').car;
    var x, i;

    this.cars = this.game.add.group();
    this.foxs = this.game.add.group();
    this.cats = this.game.add.group();
    //enable physics in them
    this.cars.enableBody = true;
    this.foxs.enableBody = true;
    this.cats.enableBody = true;
    
    for (i = 0; i < numCats; i++) {
      x = (this.game.width/2) + this.game.rnd.integerInRange(0, this.game.width*2);
      cat = this.cats.create(x, this.game.height-catData.pos, 'cat');
 
      //physics properties
      cat.body.velocity.x = parseInt('-'+catData.velocity);
      
      cat.body.immovable = true;
      cat.body.collideWorldBounds = false;
      cat.worth = catData.points;
      cat.counted = false;
    }
    for (i = 0; i < numFoxs; i++) {
      //add sprite within an area excluding the beginning and ending
      //  of the game world so items won't suddenly appear or disappear when wrapping
      x = (this.game.width/2) + this.game.rnd.integerInRange(0, this.game.width*3);
      fox = this.foxs.create(x, this.game.height-foxData.pos, 'fox');
 
      //physics properties
      fox.body.velocity.x = parseInt('-'+foxData.velocity);
      
      fox.body.immovable = true;
      fox.body.collideWorldBounds = false;
      fox.worth = foxData.points;
      fox.counted = false;
    }
    for (i = 0; i < numCars; i++) {
      //add sprite within an area excluding the beginning and ending
      //  of the game world so items won't suddenly appear or disappear when wrapping
      x = (this.game.width/2) + this.game.rnd.integerInRange(0, this.game.width*4);
      car = this.cars.create(x, this.game.height-carData.pos, 'car');
 
      //physics properties
      car.body.velocity.x = parseInt('-'+carData.velocity);
      
      car.body.immovable = true;
      car.body.collideWorldBounds = false;
      car.worth = carData.points;
      car.counted = false;
    }
  },
  playerJump: function() {
    //when the ground is a sprite, we need to test for "touching" instead of "blocked"
    if (this.player.body.touching.down) {
      var that = this;
      this.player.body.velocity.y -= this.playerData.jump;
      if (this.playerInFront) {
        setTimeout(function(){ that.playerInFront = false; }, this.playerData.jump/4);
        setTimeout(function(){
          that.game.world.bringToTop(that.player);
          that.game.world.bringToTop(that.grass);
          that.game.world.bringToTop(that.dirt);
        }, this.playerData.jump/2);
      } else {
        setTimeout(function(){ that.playerInFront = true; }, this.playerData.jump/4);
        setTimeout(function(){
          that.game.world.bringToTop(that.grass);
          that.game.world.bringToTop(that.dirt);
          that.game.world.bringToTop(that.player);
        }, this.playerData.jump/2);
      }
    }
  },
  playerStrafeR: function() {
    //when the ground is a sprite, we need to test for "touching" instead of "blocked"
    if (this.player.body.touching.down) {
      this.player.body.velocity.x += this.playerData.move;
    }
  },
  playerStrafeL: function() {
    //when the ground is a sprite, we need to test for "touching" instead of "blocked"
    if (this.player.body.touching.down) {
      this.player.body.velocity.x -= this.playerData.move;
    }
  },
  playerHit: function(player, obstacle) {
    var dateNow = +new Date();
    var time3secAgo = +new Date(dateNow - 3000);
    if (obstacle.counted !== false && obstacle.counted < time3secAgo) {
      obstacle.counted = false;
    }
    if (obstacle.counted === false) {
      if (this.playerData.avoids.indexOf(obstacle.key) !== -1) {
        this.points += obstacle.worth*this.playerData.multiplier;
        if (this.playerInFront && obstacle.key !== 'car') {
          this.points += (obstacle.worth*2)*this.playerData.multiplier;
          obstacle.destroy();
          //@TODO handle obstacle defeated animation
        }
        this.refreshStats();
      } else {
        if (this.playerInFront && obstacle.key === 'car') {
          this.points += obstacle.worth*this.playerData.multiplier;
          this.refreshStats();
        } else if (!this.playerInFront && obstacle.key !== 'car') {
          this.points += obstacle.worth*this.playerData.multiplier;
          this.refreshStats();
        } else if (this.playerInFront && obstacle.key !== 'car') {
          debug(player.key + ' killed by ' + obstacle.key + "\t Points: " + this.points);
          this.game.state.destroy();
        } else if (!this.playerInFront && obstacle.key === 'car') {
          debug(player.key + ' killed by ' + obstacle.key + "\t Points: " + this.points);
          this.game.state.destroy();
        }
      }
    } else if (this.playerData.avoids.indexOf(obstacle.key) === -1) {
      if (this.playerInFront && obstacle.key !== 'car') {
        debug(player.key + ' killed by ' + obstacle.key + "\t Points: " + this.points);
        this.game.state.destroy();
      } else if (!this.playerInFront && obstacle.key === 'car') {
        debug(player.key + ' killed by ' + obstacle.key + "\t Points: " + this.points);
        this.game.state.destroy();
      }
    }
    
    obstacle.counted = dateNow;
  },
  refreshStats: function() {
    this.pointsText.text = this.points;
    //this.timeText.text = this.maxScratches - this.scratches;
  },
  togglePause: function() {
    this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
  }
};