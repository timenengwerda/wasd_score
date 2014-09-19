jQuery('document').ready(function() {
/*	jQuery('.highscoresBtn').click( function() {
		jQuery.post('highscores.php', ({requestScores: 1}), function(result) {
			showHighscore(result.highscores);
		});
	});

	jQuery('.start').click( function() {
		jQuery('.startScreen').css('display', 'none');
		init();
	});*/

	init();
});

//set playerspeed
var speed = 5;

var playerBurstSpeed = 6;

//set powerup fallspeed
var powerUpSpeed = 3;

//The speed of when a bullet has to be fired
var enemyAttackSpeed = 8;
var attackSpeed = 8;

var enemyShootTimer = 0;
var enemyBurstCounter = 12; // Enemies are spawned with one bullet
var enemyShootTime = 210; // The time in fps(60/enemyshoottime) before another burst shot appears from enemy
var amountOfBulletsInBurst = 3;

//Since the layer is randomly used it's defined here to avoid weird checks to see if a new layer should be made
var powerUpLayer = false;
//Create an array to fill with powerups(10% chance on death of an enemy)
var powerUp = [];

//Create an array in which the used up playerbullets will be stored to be reset and used later on(When it's needed)
var unusedPlayerBullets = [];

//same goes for enemybullets
var unusedEnemyBullets = [];

var initialPause = 0;

var preloading = true;

var stage = false;
function init() {
	if (!stage) {
		stage = new createjs.Stage('test');
	}

	//Create an array with all the sprites
	var sprites = {
		enemy: "resources/sprites/enemy_spritesheet.png",
		player: "resources/sprites/player_sprite.png",
		powerup_speed: "resources/sprites/powerup_speed_sprite.png",
		powerup_bulletspeed: "resources/sprites/powerup_bulletspeed_sprite.png",
		powerup_bullet: "resources/sprites/powerup_bullet_sprite.png",
		powerup_missile: "resources/sprites/powerup_missile_sprite.png",
		powerup_missile: "resources/sprites/powerup_health_sprite.png",
		healthbar_frame: "resources/sprites/player_healthbar_frame_sprite.png",
		healthbar_hp: "resources/sprites/player_healthbar_hp_sprite.png",
		enemyBullet: "resources/sprites/enemy_bullet_sprite.png",
		playerBullet: "resources/sprites/playerbullet_sprite.png",
		missileCount: "resources/sprites/missile_count_sprite.png",
		playerCursor: "resources/sprites/cursor_sprite.png",
		menuCursor: "resources/sprites/menucursor_sprite.png"
	}
	//Call a function in Sprite.js to preload all the sprites
	preloadSprites(sprites, function(images) {
		spriteHolder = images;
		jQuery('#preloader').css('display', 'none');

		initStartscreen();	

	});
}

function startGame() {
	//console.log(spriteHolder.enemy);
	clearStage();
	//Initiate canvas/stage
	
	//Create the background
	createBackground();

	//Add a layer to append the bullets to
	ammoLayer = new createjs.Container();
	stage.addChild(ammoLayer);

	playerInit(3);
/*
	var cntdwn = 3;
	stageNotice = new Stagenotice(cntdwn, 1);
	stageNotice.countdown();
	var countdown = setInterval(function(){
		if (!stageNotice.countdown()) {
			stageNotice.endTimer(countdown);
			createEnemies(3);
		}
	}, 800);*/
	createEnemies(3);
	startListeners();
	
	//Creates the cursor in which way the bullets fly
	createCursor();
	
	//Initialize the UI
	UIinit();

	//Start the loop with a caching system
/*	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
		window.setTimeout(callback, 1000 / 30);
	};
	})();

	window.cancelRequestAnimFrame = ( function() {
		return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
	} )();

	(function animloop(){
		looper = requestAnimFrame(animloop);
		refreshLoop();
	})();*/
	theTicker = createjs.Ticker.addEventListener("tick", refreshLoop);
	createjs.Ticker.setFPS(60);

}

//Timer is used to control the amount of bullets fired
var timer = 0;

function refreshLoop() {
	//jQuery('#fps').html(Math.round(createjs.Ticker.getMeasuredFPS()));
	enemyShootTimer++;
	//When a mousedown occurs the isFiring is set to true. In this loop it'll make the player keep firing until a mouseup event
	if (isFiring == true && timer > player.playerBurstSpeed) {
		fireBullet();
		timer = 0;
	}

	//If there are bullets the bullets should be redrawn individually
	if (bullets.length > 0) {
		for (var i = 0; i < bullets.length; i++) {
			bullets[i].draw(i);
		}
	}

	//If there are enemies they should be checked
    var burstTime = 10; // 10 frames between bullets, 3 per second
    var needToShoot = ((enemyShootTimer % burstTime) == 0);

	if (enemies.length > 0) {
		for (var i = 0; i < enemies.length; i++) {
			//enemies[i].draw();
			enemies[i].move();
			if (enemyBurstCounter < amountOfBulletsInBurst && needToShoot) {
				//If the random number between 0 and 1 is 1 the enemy will re-fire
				//if (Math.round(getRandomNumber(0, 1)) == 1) {
					createEnemyBullet(enemies[i]);
				//}
			}

			for (var j = 0; j < enemies[i].bullets.length; j++) {
				enemies[i].bullets[j].draw(i, j);
			}
		
		}
        if ((enemyShootTimer % enemyShootTime) == 0) {
            enemyBurstCounter = 0;
        } else if (needToShoot) {
            enemyBurstCounter++;
        }
	}

	if (powerUp.length > 0) {
		//Draw the powerups one by one
		for (var k = 0; k < powerUp.length; k++) {
			powerUp[k].draw(k);
		}
	}

	if (missiles.length > 0) {
		for (var l = 0; l < missiles.length; l++) {
			missiles[l].draw(l);
		}
	}


	cursorBoundingBox(cursor.x, cursor.y);
	player.draw();
	timer++;
	stage.update();
}

function youWin() {
	alert('You win');
	stopListeners();
}

function youLose() {
	//Save the score to show on the lost screen before it's destroyed in the stopListeners function
	var finishedScore = score.getScore();
	new Lostscreen(finishedScore);
	stopListeners();
}

function stopListeners() {
	stage.cursor = 'pointer';

	createjs.Ticker.removeEventListener("tick", refreshLoop);
	
	document.removeEventListener('keyup', keyUp, false);
	document.removeEventListener('keydown', keyDown, false);

	stage.removeEventListener('stagemousedown', mouseDown);

	stage.removeEventListener('stagemouseup', mouseUp);

	stage.removeEventListener('stagemouse', mouseMove);

	forceStopMoving();
	stage.update();
}

function startListeners() {
	//Hide the cursor
	stage.enableMouseOver(40);
	stage.canvas.style.cursor = "none";	
	
	document.addEventListener('keyup', keyUp, false);
	document.addEventListener('keydown', keyDown, false);

	stage.addEventListener('stagemousedown', mouseDown);

	stage.addEventListener('stagemouseup', mouseUp);

	stage.addEventListener('stagemousemove', mouseMove);

}

function cleanUp() {
	clearStage();

	delete player;
	delete score;
	if (enemies.length > 0) {
		for (var i in enemies) {
			delete enemies[i];
		}		
	}
	
	enemies = [];
}

function restartGame() {
	cleanUp();
	stage = null;
	document.getElementById("test").innerHTML = '';
	init();
}

function getRandomNumber (min, max) {
	return Math.random() * (max - min) + min;
}

function sendScore(playername, playerscore) {
	var score = {
		name: playername,
		score: playerscore
	}
	jQuery.post('highscores.php', score, function(result) {
		console.log(result);
		showHighscore(result.highscores);
		stage.update();
	});
}

function clearStage() {
	stopListeners();
	stage.clear();
}