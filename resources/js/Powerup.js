
function Powerup(startX, startY){
	this.id = 'powerup'
	this.x = startX;
	this.y = startY;

	this.width = 40;
	this.height = 40;

	//Generate a random number, deciding which powerup will be spawned.
	var randomNum = Math.round(getRandomNumber(0, 4));

	switch (randomNum) {
		case 0:
			//Playerspeed powerup
			var spriteSkin = spriteHolder.powerup_speed;
			var powerUpName = 'speed';
			//speed++;
		break;

		case 1:
			//Attackspeed powerup
			var spriteSkin = spriteHolder.powerup_bulletspeed;
			var powerUpName = 'attackSpeed';
			//attackSpeed++;
		break;

		case 2:
			//playerBurstSpeed powerup
			var spriteSkin = spriteHolder.powerup_bullet;
			var powerUpName = 'playerBurstSpeed';
			//playerBurstSpeed++;
		break;

		case 3:
			//health powerup
			var spriteSkin = spriteHolder.powerup_health;
			var powerUpName = 'healthIncrease';
			//playerBurstSpeed++;
		break;

		case 4:
			//missileIncrease powerup
			var spriteSkin = spriteHolder.powerup_missile;
			var powerUpName = 'increaseMissile';
			//playerBurstSpeed++;
		break;
	}



	this.sprite = new createjs.Bitmap(spriteSkin);
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.width = this.width;
	this.sprite.height = this.height;
	this.sprite.id = powerUpName;
	//this.sprite.id = powerUpName;
	this.collide = function () {
		switch (this.sprite.id) {
			case 'speed':
				if (player.speed < 10) {
					player.speed++;
				}
			break;

			case 'attackSpeed':
				if (player.attackSpeed < 15) {
					player.attackSpeed += 2;
				}
			break;

			case 'playerBurstSpeed':
				if (player.playerBurstSpeed > 1) {
					player.playerBurstSpeed-=2;
				}
			break;

			case 'healthIncrease':
				player.increaseHealth();
			break;

			case 'increaseMissile':
				if (missileCount < 3) {
					missileCount++;
					missileStatus.increaseMissiles(missileCount);
				}
			break;


		}
		powerUp.splice(0, 1);
		powerUpLayer.removeChild(this.sprite);
		delete this;
	}

	this.targetX = this.x;
	this.targetY = stage.canvas.height+this.height;

	distance = Math.sqrt(this.targetX * this.targetX + this.targetY * this.targetY);

	this.velX = (this.targetX / distance) * powerUpSpeed;
	this.velY = (this.targetY / distance) * powerUpSpeed;

	this.draw = function (index) {
		if (this.y >= this.targetY) {
			powerUp.splice(index, 1);
			powerUpLayer.removeChild(this.sprite);
			delete this;
		} else {
			this.y += this.velY;
			this.sprite.x = this.x;
			this.sprite.y = this.y;
		}
	}

}