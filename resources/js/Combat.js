function Bullet(destinationX, destinationY) {
	this.id = 'bullet';

	this.attackSpeed = player.attackSpeed;
/*	//Get the center/center of the sprite. This is where the bullet will start
	this.x = player.sprite.x+(player.sprite.width/2);
	this.y = player.sprite.y +(player.sprite.height/2);

	var targetX = destinationX - this.x,
		targetY = destinationY - this.y,
		distance = Math.sqrt(targetX * targetX + targetY * targetY);

	//The velocity is the X and Y to where the bullet flies every tick
	this.velX = (targetX / distance) * attackSpeed;
	this.velY = (targetY / distance) * attackSpeed;*/

	this.finished = false;

	//Create the sprite(skin)
	this.sprite = new createjs.Bitmap(spriteHolder.playerBullet);

	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.width = 3;
	this.sprite.height = 3;

	var startX = player.sprite.x ;
	var startY = player.sprite.y;

	
	var bulletProps = new bulletProperties(destinationX, destinationY, startX, startY, this);
	this.x = bulletProps.x;
	this.y = bulletProps.y;

	this.velX = bulletProps.velX;
	this.velY = bulletProps.velY;


	this.draw = function(index) {
		var mayDelete = false;

		this.x += this.velX;
		this.y += this.velY;

		this.sprite.x = this.x;
		this.sprite.y = this.y;

		if(collisionDetection(this, enemies) == true) {
			mayDelete = true;
		}

		if (bulletLeftField(this.sprite) == true) {
			mayDelete = true;
		}

		if (mayDelete == true) {
			ammoLayer.removeChild(this.sprite);
			unusedPlayerBullets.push(this);
			bullets.splice(index, 1);
		}
	}
}

function Enemybullet(destinationX, destinationY, enemySprite) {
	this.id = 'enemyBullet';
	this.attackSpeed = enemyAttackSpeed;
	this.damage = enemy.damage;



	this.finished = false;
	
	//Create the sprite(skin)
	this.sprite = new createjs.Bitmap(spriteHolder.enemyBullet);
	this.sprite.width = 4;
	this.sprite.height = 4;
	this.sprite.x = destinationX;
	this.sprite.y = destinationY;

	var startX = enemySprite.x+(enemySprite.width/2);
	var startY = enemySprite.y +(enemySprite.height/2);
	var bulletProps = new bulletProperties(destinationX, destinationY, startX, startY, this);
	
	this.x = bulletProps.x;
	this.y = bulletProps.y;

	this.velX = bulletProps.velX;
	this.velY = bulletProps.velY;


	this.draw = function(indexEnemy, indexBullet) {
		
		var mayDelete = false;

		this.x += this.velX;
		this.y += this.velY;

		this.sprite.x = this.x;
		this.sprite.y = this.y;
		//console.log(this.sprite.x);


		if(collisionDetection(this, player) == true) {
			player.collide(this);
			mayDelete = true;
		}

		if (bulletLeftField(this.sprite) == true) {
			mayDelete = true;
		}

		if (mayDelete == true) {

			ammoLayer.removeChild(this.sprite);
			unusedEnemyBullets.push(this);
			if (enemies[indexEnemy]) {
				enemies[indexEnemy].bullets.splice(indexBullet, 1);
			}
		}

	}
}

function bulletLeftField(projectile) {
	if (projectile.x < -50
	||
	projectile.x > stage.canvas.width+50
	||
	projectile.y < -50
	||
	projectile.y > stage.canvas.height+50) {
		return true;
	}

	return false;
}

function bulletProperties(destinationX, destinationY, startX, startY, obj) {
	//Get the center/center of the sprite. This is where the bullet will start
	this.x = startX;
	this.y = startY;

	if (obj.id == 'bullet') {
		var targetX = destinationX - this.x;
			targetY = destinationY - this.y;
	} else {
		//The targetX and Y are compensated by the player width and height. Subtract or add the halve of the player accordingly
		if (this.y > player.sprite.y) {
			var targetY = (destinationY - this.y) + (player.sprite.height/2);
		} else {
			var targetY = (destinationY - this.y) - (player.sprite.height/2);
		}

		if (this.x > player.sprite.x) {
			var targetX = (destinationX - this.x) + (player.sprite.width/2);
		} else {
			var targetX = (destinationX - this.x) - (player.sprite.width/2);
		}
	}

	distance = Math.sqrt(targetX * targetX + targetY * targetY);

	//The velocity is the X and Y to where the bullet flies every tick
	this.velX = (targetX / distance) * obj.attackSpeed;
	this.velY = (targetY / distance) * obj.attackSpeed;
}

function fireBullet() {
	//If there are unushed player bullets(Added to array after they reach the end of the playfield or hit an enemy) they can be re-used instead of creating a new bullet
	if (unusedPlayerBullets.length > 0) {
		//get the first bullet out of the array and remove that bullet from the array
		bullet = unusedPlayerBullets[0];
		unusedPlayerBullets.splice(0, 1);

		var startX = player.sprite.x;
		var startY = player.sprite.y;

		var destinationX = cursor.x + (cursor.width/2);
		var destinationY = cursor.y+(cursor.width/2);
		bulletProps = new bulletProperties(destinationX, destinationY, startX, startY, bullet);

		//Give the bullet and sprite new X and Y coordinates etc.
		bullet.x = bulletProps.x;
		bullet.y = bulletProps.y;

		bullet.velX = bulletProps.velX;
		bullet.velY = bulletProps.velY

	} else {
		bullet = new Bullet(cursor.x + (cursor.width/2), cursor.y+(cursor.width/2));
	}
	ammoLayer.addChild(bullet.sprite);
	bullets.push(bullet);
}

function collisionDetection(object, objectToHit) {
	var collider =  object.sprite;


	//If the objectToHit doesnt have an ID it's assumed it's an array. Therefore it has to loop through it's sprites.
	//If there is an ID it's a single object

	if (!objectToHit.id) {	
		if (objectToHit.length > 0) {
			for(var index in objectToHit) {
				var collidee =  objectToHit[index].sprite;

				if (collider.x < collidee.x + collidee.width &&
					collider.x + collider.width > collidee.x &&
					collider.y < collidee.y + collidee.height &&
					collider.y + collider.height > collidee.y) {

						if (object.id == 'bullet' || object.id == 'missile') {
							enemies[index].flickr();
							enemies[index].collide(index, object);
						} else {
							player.flickr();
							player.collide(enemies[index]);
						}
						return true;
				}
			}
		}
	} else {
		var collidee =  objectToHit.sprite;
		/*	var hitFrameTopLeft = {x: collidee.x, y: collidee.y};
		var hitFrameTopRight = {x: collidee.x+collidee.width, y: collidee.y};

		var hitFrameBottomLeft = {x: collidee.x, y: collidee.y+collidee.height};
		var hitFrameBottomRight = {x: collidee.x+collidee.width, y: collidee.y+collidee.height};

		var projectileX = collider.x;
		var projectileY = collider.y;

		if (projectileX > hitFrameTopLeft.x && projectileX < hitFrameTopRight.x
			&& projectileY > hitFrameTopLeft.y && projectileY < hitFrameBottomRight.y) {
			return true;
		}*/

		if (collider.x < collidee.x + collidee.width &&
		collider.x + collider.width > collidee.x &&
		collider.y < collidee.y + collidee.height &&
		collider.y + collider.height > collidee.y) {
			return true;
		}
	}
	return false;
}

function Missile() {
	this.id = 'missile';
	this.attackSpeed = attackSpeed;
	this.damage = '200';

	//Create the sprite(skin)
	this.sprite = new createjs.Shape();
	this.sprite.width = stage.canvas.width;
	this.sprite.height = 15;
	this.sprite.graphics
		.beginFill('yellow')
		.drawRect(0, 0, this.sprite.width, this.sprite.height)
	

/*	var spriteSheet = new createjs.SpriteSheet({
		// image to use
		images: ["resources/sprites/wipe_tile_spritesheet.png"], 
			// width, height & registration point of each sprite
			frames: {width: 38, height: 30, regX: 0, regY: -10}, 
			animations: {    
			walk: [1, 4, "walk", 1]
		}
	});

	bmpAnimation = new createjs.BitmapAnimation(spriteSheet);
	bmpAnimation.currentFrame = 0;
	bmpAnimation.name = "monster1";
	bmpAnimation.x = 0;
	bmpAnimation.y = 0;
	ammoLayer.addChild(bmpAnimation);*/
		// start playing the first sequence:


	this.sprite.x = 0;
	this.sprite.y = stage.canvas.height + this.sprite.height;

	var startX = 0;
	var startY = this.sprite.y;
	var bulletProps = new bulletProperties(0, -this.sprite.height, startX, startY, this);
	
	this.x = bulletProps.x;
	this.y = bulletProps.y;

	this.velX = bulletProps.velX;
	this.velY = bulletProps.velY;


	this.draw = function(index) {
		//bmpAnimation.gotoAndPlay("walk");     //animate
		// Moving the sprite based on the direction & the speed

		var mayDelete = false;
		this.y += this.velY;
		this.sprite.y = this.y;

		if(collisionDetection(this, enemies) == true) {
			//mayDelete = true;
		}

		if (bulletLeftField(this.sprite) == true) {
			mayDelete = true;
		}

		if (mayDelete == true) {
			ammoLayer.removeChild(this.sprite);
			//unusedPlayerBullets.push(this);
			missiles.splice(index, 1);
		}
	}
}


var missiles = [];
var missileCount = 3;
var burstCount = 0;
function fireMissile() {
	if (missileCount > 0) {
		var intv = setInterval(function() {
			if (burstCount < 3) {
				missile = new Missile();
				missiles.push(missile);
				burstCount++;
				ammoLayer.addChild(missile.sprite);
			} else {
				clearInterval(intv);
				burstCount = 0;
			}
		}, 150);
		missileCount--;
		missileStatus.decreaseMissiles(missileCount);
	}
}