function preloadSprites(sprites, callback) {

	var images = {};
	var loadedImages = 0;
	var numImages = 0;

	// get num of sources
	for(var src in sprites) {
		numImages++;
	}



	for(var src in sprites) {
		images[src] = new Image();
		images[src].onload = function() {
			if(++loadedImages >= numImages) {
				callback(images);
			}
		};
		images[src].src = sprites[src];
	}
}