var mapWidth = 1000;
var mapHeight = 600;
var tileWidth = 50;
var tileHeight = 50;
var tiles = [];
function Map() {
	createBackground();
	this.width = mapWidth;
	this.height = mapHeight;
	this.x = 0;
	this.y = 0;
	amountOfTiles = (mapWidth/tileWidth)*(mapHeight/tileHeight);
	for (var i = 0; i < amountOfTiles; i++) {
		tiles.push(new Tile(i));
	}

	xPos = 0-tileWidth;
	tileCount = 1;
	rows = 0;
	tilesPerRow = mapWidth/tileWidth;
	for (i in tiles) {
		t = tiles[i];
		xPos += t.width;
		t.x = xPos;

		if (tileCount == tilesPerRow) {
			t.y += t.height*rows;
			rows++;
			tileCount = 1;
			xPos = 0-tileWidth;
		} else {
			t.y = tileHeight*rows;
			tileCount++;
		}
		tileToContext(t);
	}
}

function Tile(id) {
	this.id = id;
	this.width = tileWidth;
	this.height = tileHeight
	this.x = 0;
	this.y = 0;
	this.fill = 'yellow';
}

function tileToContext(tile) {
	context.beginPath();
	context.rect(tile.x, tile.y, tile.width, tile.height);
	context.fillStyle = tile.fill;
	context.fill();

	context.lineWidth = 1;
	context.strokeStyle = 'black';
	context.stroke();
}

function createBackground() {
	/*backgroundLayer = new Kinetic.Layer();
	var bg = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: stage.getWidth(),
		height: stage.getHeight(),
		fill: 'green'
	});*/

	
	var shape = new createjs.Shape();
	shape.graphics.beginFill("black")
	shape.graphics.drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	stage.addChild(shape);
}