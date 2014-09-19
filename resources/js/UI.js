function UIinit() {
	healthbar = new Healthbar();
	uiLayer = new createjs.Container();


	uiLayer.addChild(healthbar.statusBar);
	uiLayer.addChild(healthbar.statusFrame);

	lives = new liveCounter();
	uiLayer.addChild(lives.liveCounter);

	missileStatus = new Missilestatus();
	uiLayer.addChild(missileStatus.missileOne);
	uiLayer.addChild(missileStatus.missileTwo);
	uiLayer.addChild(missileStatus.missileThree);

	missileStatus.increaseMissiles(missileCount);

	if (typeof score == "undefined") {
		score = new scoreCounter();
	}
	
	uiLayer.addChild(score.scoreCounter);

	stage.addChild(uiLayer);
}

function Missilestatus() {
	this.x = healthbar.x;
	this.y = healthbar.y + healthbar.height + 20;

	this.missileOne = new createjs.Bitmap(spriteHolder.missileCount);
	this.missileOne.x = this.x;
	this.missileOne.y = this.y;
	this.missileOne.visible = false;

	this.missileTwo  = new createjs.Bitmap(spriteHolder.missileCount);
	this.missileTwo.x = this.x + 20;
	this.missileTwo.y = this.y;
	this.missileTwo.visible = false;

	this.missileThree = new createjs.Bitmap(spriteHolder.missileCount);
	this.missileThree.x = this.x + 40;
	this.missileThree.y = this.y;
	this.missileThree.visible = false;

	this.decreaseMissiles = function(amountOfMissiles) {
		if (amountOfMissiles < 3) {
			this.missileThree.visible = false;
		}

		if (amountOfMissiles < 2) {
			this.missileTwo.visible = false;
		}

		if (amountOfMissiles == 0) {
			this.missileOne.visible = false;
		}
	}

	this.increaseMissiles = function(amountOfMissiles) {
		if (amountOfMissiles > 0) {
			this.missileOne.visible = true;
		}

		if (amountOfMissiles > 1) {
			this.missileTwo.visible = true;
		}

		if (amountOfMissiles == 3) {
			this.missileThree.visible = true;
		}
	}
}

function Healthbar() {
	this.totalHealth = player.health;
	this.x = 24;
	this.y = 30;

	this.fullBarWidth = 136;

	this.width = this.fullBarWidth;
	this.height = 13;

	//Create the statusbar(The healthbar itself)
/*	this.statusBar = new createjs.Shape()
	this.statusBar.graphics
		.beginFill("red")
		.drawRect(0, 0, this.width, this.height);*/
	this.statusBar = new createjs.Bitmap(spriteHolder.healthbar_hp);
	this.statusBar.x = this.x;
	this.statusBar.y = this.y;
	this.statusBar.width = this.width;
	this.statusBar.height = this.height;

	//Create a stroked outline around the healthbar.
	this.statusFrame = new createjs.Bitmap(spriteHolder.healthbar_frame);
	this.statusFrame.x = this.statusBar.x-7;
	this.statusFrame.y = this.statusBar.y;
	this.statusFrame.width = 150;
	this.statusFrame.height = 29;

	//Function to decrease/increase the width of the statusbar
	this.changeHealthbar = function() {
		percentageLeft = (player.health/player.fullPlayerHealth)*100;
		this.statusBar.scaleX = percentageLeft/100;
	}

}

function liveCounter() {
	this.x = healthbar.statusFrame.x + (healthbar.statusFrame.width+15);
	this.y = healthbar.statusFrame.y;
	
	this.liveCounter = new createjs.Text(player.lives, '30px Calibri', '#fff');
	this.liveCounter.x = this.x;
	this.liveCounter.y = this.y;
}

function scoreCounter() {
	this.x = stage.canvas.width-(stage.canvas.width/4);
	this.y = healthbar.statusFrame.y;
	this.newScore = 0;
	
	this.scoreCounter = new createjs.Text(this.newScore, '30px Calibri', '#FFF');
	this.scoreCounter.x = this.x;
	this.scoreCounter.y = this.y;


	this.increaseScore = function(amount) {
		this.newScore += amount;
		this.scoreCounter.text = this.newScore;
	}

	this.getScore = function() {
		return this.newScore;
	}
}

function Lostscreen(finishedScore) {
	this.bg = new createjs.Shape()
	this.bg.graphics
		.beginFill("red")
		.drawRect(0, 0, stage.canvas.width, stage.canvas.height);

	this.txt = new createjs.Text('The game: You lost it. You\'ve scored a stunning ' + finishedScore + ' points!', '30px Calibri', '#000');
	this.txt.x = 200;
	this.txt.y = 15;


	lostLayer = new createjs.Container();
	lostLayer.addChild(this.bg);
	lostLayer.addChild(this.txt);

	stage.addChild(lostLayer);

	createHighscoreInput(finishedScore);
}

function createHighscoreInput(score) {
	var txt = jQuery('<div id="highscoreText">Submit your name for the highscores!</div>')
	var nameInput = jQuery('<input id="playername" type="text" name="playername" maxlength="9">');
	var button = '<button id="saveScore">Save score</button>';
	jQuery('#htmlBlock').css('display', 'block');
	jQuery('#htmlBlock').append(nameInput);
	jQuery('#htmlBlock').append(button);
	jQuery('#htmlBlock').append(txt);

	jQuery('#playername').css('height', '66');
	jQuery('#playername').css('width', '400');
	jQuery('#playername').css('font-size', '55');
	jQuery('#playername').css('font-weight', 'bold');
	jQuery('#playername').css('text-align', 'center');
	jQuery('#playername').css('z-index', '999');
	jQuery('#playername').css('position', 'absolute');
	jQuery('#playername').css('left', (stage.canvas.width/2)-(jQuery('#playername').width()/2));
	jQuery('#playername').css('top', stage.canvas.height/2);

	jQuery('#saveScore').css('height', '66');
	jQuery('#saveScore').css('width', '400');
	jQuery('#saveScore').css('background', 'green');
	jQuery('#saveScore').css('font-family', 'Calibri');
	jQuery('#saveScore').css('font-size', '25');
	jQuery('#saveScore').css('font-weight', 'bold');
	jQuery('#saveScore').css('color', '#000');
	jQuery('#saveScore').css('z-index', '999');
	jQuery('#saveScore').css('position', 'absolute');
	jQuery('#saveScore').css('left', (stage.canvas.width/2)-(jQuery('#saveScore').width()/2));
	jQuery('#saveScore').css('top', (stage.canvas.height/2) + (jQuery('#playername').height() + 25));

	jQuery('#highscoreText').css('height', '66');
	jQuery('#highscoreText').css('width', '400');
	jQuery('#highscoreText').css('font-family', 'Calibri');
	jQuery('#highscoreText').css('font-size', '25');
	jQuery('#highscoreText').css('font-weight', 'bold');
	jQuery('#highscoreText').css('text-align', 'center');
	jQuery('#highscoreText').css('z-index', '999');
	jQuery('#highscoreText').css('position', 'absolute');
	jQuery('#highscoreText').css('left', jQuery('#playername').css('left'));
	jQuery('#highscoreText').css('top', (stage.canvas.height/2) - 50);
	
	jQuery('#saveScore').click(function() {
		var playername = (jQuery('#playername').val() != "") ? jQuery('#playername').val() : 'Anon';
		jQuery('#htmlBlock').css('display', 'none');
		sendScore(playername, score);
	});
}

function showHighscore(scores) {
/*
	jQuery('.highscoreList').css('display', 'block');
	if (scores.player) {
		var list = '<ul class="highscores">';
		var rank = 1;
		for (var i = 0; i < scores.player.length; i++) {
			list += '<li>' + rank + '. ' + scores.player[i].name + ' - ' + scores.player[i].score + '</li>';
			rank++;
		}
		list += '</ul>';
		jQuery('.highscoreList').prepend(list);
		var ul = jQuery('.highscores');

		ul.css ({
			'position': 'absolute',
			'width': 600,
			'top': 50,
			'left': 300,
		});
		ul.find('li').css ({
			'float': 'left',
			'width': 600,
			'font-size': '30px',
			'text-align': 'center',
			'font-family': 'Calibri'
		})
	}*/

	stage.clear();


	scoresLayer = new createjs.Container();

	background = new createjs.Shape();
	background.graphics
		.beginFill('pink')
		.drawRect(0, 0, stage.canvas.width, stage.canvas.height);

	scoresLayer.addChildAt(background);
	stage.addChild(scoresLayer);

	
	var startY = 50;
	var place = 1;

	title = new createjs.Text('Highscores', '40px Calibri', '#FFF');
	title.width = 300;
	title.textAlign = 'center';
	title.y = startY-15;
	title.x = (stage.canvas.width/2);
	scoresLayer.addChild(title);

	console.log(scores);
	if (scores.player) {
		for (var i = 0; i < scores.player.length; i++) {
			startY+= 50;
			playerName = new createjs.Text(place +'. '+scores.player[i].name + ' '+ scores.player[i].score, '30px Calibri', '#FFF');
			playerName.width = 300;
			playerName.textAlign = 'center';
			playerName.y = startY;
			playerName.x = (stage.canvas.width/2);

			
			place++;
			scoresLayer.addChild(playerName);
		}
	}
	backButton = new createjs.Shape();
	backButton.graphics
		.beginFill('black')
		.drawRect(0, 0, 125, 40);
	backButton.x = stage.canvas.width-150;
	backButton.y = 25;

	backText = new createjs.Text('back', '30px Calibri', '#FFF');
	backText.width = 125;
	backText.textAlign = 'center';
	backText.y = 25;
	backText.x = stage.canvas.width-90;

	scoresLayer.addChild(backButton);
	scoresLayer.addChild(backText);

	backButton.addEventListener("click", function () {
		stage.removeChild(scoresLayer);
	});
	
}


function initStartscreen() {
	startscreenLayer = new createjs.Container();

	createMenuCursor();

	stage.addEventListener("stagemousemove", mouseMove);
/*	stage.enableMouseOver(2);
	stage.cursor = 'none';*/
	Startscreen = new Startscreen();

	startscreenLayer.addChild(Startscreen.background);

	startscreenLayer.addChild(Startscreen.startButton);
	startscreenLayer.addChild(Startscreen.startText);

	startscreenLayer.addChild(Startscreen.highscoreButton);
	startscreenLayer.addChild(Startscreen.highscoreText);

	stage.addChildAt(startscreenLayer, 0);

	stage.update();

	Startscreen.startButton.addEventListener('click', function() {
		startGame();
	});

	Startscreen.highscoreButton.addEventListener('click', function() {
		jQuery.post('highscores.php', ({requestScores: 1}), function(result) {
			showHighscore(result.highscores);
		});
	});

	
}

function Startscreen() {
	this.background = new createjs.Shape();
	this.background.graphics
		.beginFill('pink')
		.drawRect(0, 0, stage.canvas.width, stage.canvas.height);

	this.startButton = new createjs.Shape();
	this.startButton.graphics
		.beginFill('#000')
		.drawRect(0, 0, 250, 50)
	this.startButton.x = (stage.canvas.width/2)-125;
	this.startButton.y = 150;
	this.startButton.name = "startButton";

	this.startText = new createjs.Text('Start', '30px Calibri', '#FFF');
	this.startText.x = this.startButton.x + 95;
	this.startText.y = this.startButton.y + 7;


	this.highscoreButton = this.startButton.clone();
	this.highscoreButton.y = this.startButton.y + 75;

	this.highscoreText = new createjs.Text('Highscore', '30px Calibri', '#FFF');
	this.highscoreText.x = this.highscoreButton.x + 65;
	this.highscoreText.y = this.highscoreButton.y + 7;
}

function Stagenotice(cntdwn, stageCount) {
	countdownLayer = new createjs.Container();
	countdownLayer.name = 'countdownLayer';
	stage.addChild(countdownLayer);

	this.count = cntdwn;

	this.countdown = function() {
		countdownLayer.removeAllChildren();
		this.count--;
		if (this.count >= 0) {
			if (this.count > 1) {
				this.countdownText = new createjs.Text('Stage ' + stageCount, '50px Calibri', '#FFF');
			}

			if (this.count == 1) {
				this.countdownText = new createjs.Text('Get set', '50px Calibri', '#FFF');
			}

			if (this.count == 0) {
				this.countdownText = new createjs.Text('Go!', '50px Calibri', '#FFF');
			}

			this.countdownText.x = (stage.canvas.width/2);
			this.countdownText.y = (stage.canvas.height/2)-50;

			countdownLayer.addChild(this.countdownText);
			
			
			//stage.update();
			return true;
		} else {
			//stage.update();
			return false;
		}
		
	}

	this.endTimer = function(intervalToStop) {
		stage.removeChild(stage.getChildByName('countdownLayer'));
		clearInterval(intervalToStop);
	}
}