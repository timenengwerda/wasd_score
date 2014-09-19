var bullets = [];
var isFiring = false;
function mouseDown() {
	timer = 0;
	isFiring = true;
	//fireBullet();
}

var cursorRange = 150;

function mouseMove(e) {

	if (cursor) {
		if (typeof player != 'undefined' && player.sprite) {
			//Rotate the sprite to the cursor
			boxCenter = [player.sprite.x-(player.sprite.width/2), player.sprite.y-(player.sprite.height/2)];
			var angle = Math.atan2(e.nativeEvent.pageX- boxCenter[0], e.nativeEvent.pageY- boxCenter[1])*(180/Math.PI);	
			angle = angle < 0 ? Math.abs(angle) :  angle = 360 - angle;

			player.sprite.rotation = angle;
		}
	}

	if (menuCursor || cursor) {
		cursorToMove = (!menuCursor) ? cursor : menuCursor;
		if (e.rawX && e.rawY) {
			cursorBoundingBox(cursorToMove, e.rawX, e.rawY);
			if (menuCursor) {
				stage.update();
			}
		}
	}

}

function cursorBoundingBox(cursorToMove, x, y) {
	var newX = x;
	var newY = y;
/*	if (sprite.getX()-x > cursorRange || sprite.getX()-x < -cursorRange) {
		newX = (sprite.getX() > x) ? sprite.getX()-cursorRange : sprite.getX()+cursorRange;
	}

	if (sprite.getY()-y > cursorRange || sprite.getY()-y < -cursorRange) {
		newY = (sprite.getY() > y) ? sprite.getY()-cursorRange : sprite.getY()+cursorRange;
	}

	*/

	cursorToMove.x =newX
	cursorToMove.y = newY;
	
}

function createCursor() {
	menuCursor = false;
	cursor = new createjs.Bitmap(spriteHolder.playerCursor);
	cursor.x = stage.canvas.width/2;
	cursor.y = stage.canvas.height/2;
	cursor.width = 40;
	cursor.height = 40;

	cursorLayer = new createjs.Container();
	cursorLayer.addChild(cursor);
	stage.addChild(cursorLayer);
}

function createMenuCursor() {
	cursor = false;
	menuCursor = new createjs.Bitmap(spriteHolder.menuCursor);
	menuCursor.x = stage.canvas.width/2;
	menuCursor.y = stage.canvas.height/2;
	menuCursor.width = 40;
	menuCursor.height = 40;

	cursorLayer = new createjs.Container();
	cursorLayer.addChild(menuCursor);
	stage.addChildAt(cursorLayer);	
}



function mouseUp() {
	isFiring = false;
}