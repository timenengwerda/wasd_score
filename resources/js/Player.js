function playerInit(lives) {
	//Create a player and add it to a special layer.
	player = new Player();
	player.lives = lives;
	playerLayer =  new createjs.Container();
	playerLayer.addChild(player.sprite);
	stage.addChild(playerLayer);
	//Initiate a variable for the sprite(The visual object)
	//sprite = playerLayer.get('.sprite')[0];
}

function Player() {
	this.id = 'player';
	this.x = stage.canvas.width/2;
	this.y = stage.canvas.height/2;
	this.width = 38;
	this.height = 23;

	this.speed = speed;
	this.attackSpeed = attackSpeed;
	this.playerBurstSpeed = playerBurstSpeed;

	this.damage = 85;

	this.fullPlayerHealth = 500;
	this.health = this.fullPlayerHealth;

	//Create the player sprite(The skin)
	this.sprite = new createjs.Bitmap(spriteHolder.player);
	this.sprite.rotation = 90;
	
	this.sprite.x = this.x;
	this.sprite.y = this.y;

	this.sprite.width = this.width;
	this.sprite.height = this.height;

	this.sprite.regX = this.sprite.width/2;
	this.sprite.regY = this.sprite.height/2;


	this.move = function() {
		spr = this.sprite;

		if (up == true) {
			spr.y = spr.y-(1*player.speed);
			if (spr.y <= 0) {
				spr.y = 0;
			}
		}

		if (down == true) {
			spr.y = spr.y+(1*player.speed);
			if (spr.y >= stage.canvas.height-spr.height) {
				spr.y = stage.canvas.height-spr.height;
			}
		}

		if (left == true) {
			spr.x = spr.x-(1*player.speed);
			if (spr.x <= 0) {
				spr.x = 0;
			}
		}

		if (right == true) {
			spr.x = spr.x+(1*player.speed);
			if (spr.x >= stage.canvas.width-spr.width) {
				spr.x = stage.canvas.width-spr.width;
			}
		}

		if (enemies.length > 0) {
			collisionDetection(this, enemies);
		}

		if (powerUp.length > 0) {
			if (collisionDetection(this, powerUp[0])) {
				powerUp[0].collide();
			}
		}
	}

	this.collide = function(object) {
		this.flickr();
		damage = object.damage;
		this.health -= damage;
		healthbar.changeHealthbar();
		if (this.health <= 0) {
			checkLives();
		}
	}

	this.flickr = function() {
		this.sprite.alpha = 0.5;
		var enem = this.sprite;
		setTimeout(function() {
			enem.alpha = 1;
		}, 100);
	}

	this.draw = function() {
		this.move();
		//playerLayer.draw();
	}

	this.increaseHealth = function () {
		var healthToIncrease = 100;
		if ((this.health + healthToIncrease) <= this.fullPlayerHealth) {
			this.health += healthToIncrease;
			healthbar.changeHealthbar();
		}
	}

}

function checkLives() {
	if (player.lives > 1) {
		stage.removeChild(playerLayer);
		playerInit(player.lives-1);
		stage.removeChild(uiLayer);
		UIinit();
	} else {
		youLose();
	}
}
