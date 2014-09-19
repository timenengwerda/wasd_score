var enemyWidth = 40;
var enemyHeight = 40;
function Enemy(number) {
	this.number = number;
	this.id = 'enemy';
	var randomStartLoc = new locationOutsidePlayfield();

	enemyLoc = new locationOutsidePlayfield();
	this.x = randomStartLoc.x;
	this.y = randomStartLoc.y;

	this.health = 100;

	//The damage a collision the enemy with a player does
	this.damage = 20;

	var target = new Target(this.x, this.y);
	this.velX = target.velX;
	this.velY = target.velY;

	this.hitScore = 25;
	this.killScore = this.hitScore*2;


	var spriteSheet = new createjs.SpriteSheet({
		images: [spriteHolder.enemy], 
		frames: {width:40, height:40},
		animations: {
			walk: [0, 3]
		}
	});

	this.sprite = new createjs.BitmapAnimation(spriteSheet);
	this.sprite.currentFrame = 0;

	this.sprite = new createjs.BitmapAnimation(spriteSheet);

	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.width = enemyWidth;
	this.sprite.height = enemyHeight;


	this.collide = function(arrayIndex, bullet) {
		if (bullet) {
			this.health -= player.damage;
		}

		if (this.health <= 0) {
			//Generate a number between 0 and 10. If it's 1(10% chance) a powerup will be made on the spot of the death.
			var percentage = Math.round(getRandomNumber(0, 10));
			
			//If the percentage is one and there are no powerUps on the stage it's okay to add a powerup.
			if (percentage < 6 && powerUp.length == 0) {
				var pwrp = new Powerup(this.x, this.y);
				powerUp.push(pwrp);
				if (!powerUpLayer) {
					powerUpLayer = new createjs.Container();
					stage.addChild(powerUpLayer);
				}
				powerUpLayer.addChild(pwrp.sprite);
			}

			//Increase the score
			score.increaseScore(this.killScore);

			//Delete the object
			delete this;

			//Remove the sprite
			enemyLayer.removeChild(this.sprite);

			//Remove the enemy and the bullets from their array
			enemies.splice(arrayIndex, 1);
			for (var i in this.bullets) {
				ammoLayer.removeChild(this.bullets[i].sprite);
				delete this.bullets[i];
			}
			this.bullets = [];
		} else {
			//If the enemy didnt die, update the score with the hit score.
			score.increaseScore(this.hitScore);
		}

		countEnemies();
	}

	this.draw = function() {
		//enemyLayer.draw();
	}

	this.move = function() {
		this.sprite.gotoAndPlay("walk");  
		//Set a boolean that will check later on if the enemy should change direction. Therefore getting a new X an Y.
		var directionChange = false;
		this.x += this.velX;
		this.y += this.velY;

		this.sprite.x = this.x;
		this.sprite.y = this.y;
		
		if (this.y <= -150) {
			directionChange = true;
		}

		if (this.y >= (stage.canvas.height-this.sprite.height)+150) {
			directionChange = true;
		}

		if (this.x <= -150) {
			directionChange = true;
		}

		if (this.x >= (stage.canvas.width-this.sprite.width)+150) {
			directionChange = true;
		}

		if (directionChange == true) {
			var target = new Target(this.x, this.y);
			this.velX = target.velX;
			this.velY = target.velY;
		}
	}

	this.flickr = function() {
		this.sprite.alpha = 0.5;
		var enem = this.sprite;
		setTimeout(function() {
			enem.alpha = 1;
		}, 100);
	}

	this.bullets = [];
}

var enemySpeed = 4;
function Target(x, y) {
	//Create a random X and Y for the enemy. It will float to this spot.
	var targetX =  Math.floor(Math.random()*(stage.canvas.width-enemyWidth)+1) - x,
	targetY = Math.floor(Math.random()*(stage.canvas.height-enemyHeight)+1) - y,
	distance = Math.sqrt(targetX * targetX + targetY * targetY);

	this.velX = (targetX / distance) * enemySpeed;
	this.velY = (targetY / distance) * enemySpeed;
}


var enemies = [];
var newEnemiesAmount;
var oldEnemiesAmount;
function createEnemies(amount) {
	oldEnemiesAmount = (amount > 0) ? amount : oldEnemiesAmount;
	newEnemiesAmount = amount+(Math.floor(oldEnemiesAmount)/5)

	//Create a layer to spawn the enemies on
	enemyLayer = new createjs.Container();
	
	//Loop through the amount wanted.
	for (var i = 0; i < newEnemiesAmount; i++) {
		enemy = new Enemy(i);
		createEnemyBullet(enemy);
		//push the object in an array and add it to the newly made layer
		enemies.push(enemy);
		enemyLayer.addChild(enemy.sprite);
	}

	stage.addChild(enemyLayer);
}
var stageCount = 1;
var waveAmount = 3;
var waveCount = 0;
function countEnemies() {
	if (enemies.length == 0) {
		waveCount++;
		if (waveCount <= waveAmount) {
			createEnemies(oldEnemiesAmount);
		} else{
			stageCount++;
			if (stageCount == 4 || stageCount == 8 || stageCount == 12) {
				enemySpeed++;
			}
			var cntdwn = 3;
			stageNotice = new Stagenotice(cntdwn, stageCount);
			stageNotice.countdown();
			var countdown = setInterval(function(){
				if (!stageNotice.countdown()) {
					stageNotice.endTimer(countdown);
					createEnemies(newEnemiesAmount);
				}
			}, 800);
			waveCount = 0;
		}
	}
}

function createEnemyBullet(enemy) {
	//If there are unushed player bullets(Added to array after they reach the end of the playfield or hit an enemy) they can be re-used instead of creating a new bullet
	if (unusedEnemyBullets.length > 0) {
		//get the first bullet out of the array and remove that bullet from the array
		var blt = unusedEnemyBullets[0];
		unusedEnemyBullets.splice(0, 1);

		var startX = enemy.sprite.x+(enemy.sprite.width/2);
		var startY = enemy.sprite.y +(enemy.sprite.height/2);

		var destinationX = player.sprite.x + (player.sprite.width/2);
		var destinationY = player.sprite.y+(player.sprite.width/2);
		bulletProps = new bulletProperties(destinationX, destinationY, startX, startY, blt);

		//Give the bullet and sprite new X and Y coordinates etc.
		blt.x = bulletProps.x;
		blt.y = bulletProps.y;

		blt.velX = bulletProps.velX;
		blt.velY = bulletProps.velY

	} else {
		var blt = new Enemybullet(player.sprite.x, player.sprite.y, enemy.sprite);
	}

	ammoLayer.addChild(blt.sprite);

	enemy.bullets.push(blt);
}

function locationOutsidePlayfield() {
	//Generate a negative -100 to 0 X coordinate and one for the positive side so it'll be random -100 up to +100 outside the playfield.
	//Generate this for both X and Y and give one of both X's and Y's back at random.
	var x = [];
	x.push(getRandomNumber(-100, 0))
	x.push(getRandomNumber(stage.canvas.width, stage.canvas.width+100));

	var y = [];
	y.push(getRandomNumber(-100, 0))
	y.push(getRandomNumber(stage.canvas.height, stage.canvas.height+100));


	this.x = x[Math.round(getRandomNumber(0, 1))];
	this.y = y[Math.round(getRandomNumber(0, 1))];
}
