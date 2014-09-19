
var up = false;
var down = false;
var left = false;
var right = false;
function keyUp(e) {
	keyCode = (e.keyCode ? e.keyCode : e.which);

	if (keyCode == 37 || keyCode == 65) {
		left = false;
	}

	if (keyCode == 38 || keyCode == 87) {
		up = false;
	}

	if (keyCode == 39 || keyCode == 68) {
		right = false;
	}

	if (keyCode == 40 || keyCode == 83) {
		down = false;
	}
	if (keyCode == 32) {
		//32 is spacebar
		isFiring = false;
	}
}

function forceStopMoving() {
	left = false;
	up = false;
	right = false;
	down = false;
}


function keyDown(e) {
	keyCode = (e.keyCode ? e.keyCode : e.which);
	if (keyCode == 37 || keyCode == 65) {
		left = true;
	}

	if (keyCode == 38 || keyCode == 87) {
		up = true;
	}

	if (keyCode == 39 || keyCode == 68) {
		right = true;
	}

	if (keyCode == 40 || keyCode == 83) {
		down = true;
	}

	if (keyCode == 32) {
		/*if (missileCount > 0) {
			fireMissile();
		}*/
		mouseDown();
	}
}