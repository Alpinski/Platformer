var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;

	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}



var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";

var enemy = document.createElement("img");
Enemy.src = "Skeleton.png";

var Background = document.createElement("img");
Background.src  = "Background.png";

function playerShoot()
{
	var bullet = new Bullet()
	bullets.push(bullet);
}

var tileset = document.createElement("img");
tileset.src = level1.tilesets[0].image;

var MAP = {tw: level1.width, th: level1.height};
var TILE = level1.tilewidth;
var TILESET_TILE = level1.tilesets[0].tilewidth;
var TILESET_PADDING = level1.tilesets[0].margin;
var TILESET_SPACING = level1.tilesets[0].spacing;
var TILESET_COUNT_X = level1.tilesets[0].columns;
var TILESET_COUNT_Y = level1.tilesets[0].tilecount/TILESET_COUNT_X;
						
var LAYER_COUNT = level1.layers.length;
var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 2;
var LAYER_LADDERS = 1;

var METER = TILE;
var GRAVITY = METER * 10 * 6;
var MAXDX = METER * 35;
var MAXDY = METER * 25;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 0.5;
var JUMP = METER * 1500;

function cellAtPixelCoord(layer, x,y)
{
	if(x<0 || x>SCREEN_WIDTH)
	return 1;
	if(y>SCREEN_HEIGHT)
	return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx<0 || tx>=MAP.tw)
	return 1;
	if(ty<0 || ty>=MAP.th)
	return 0;
	return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
	return min;
	if(value > max)
	return max;
	return value;
}

function drawMap()
{
	for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++)
	{
		var offsetx = level1.layers[layerIdx].offsetx || 0;
		var offsety = level1.layers[layerIdx].offsety || 0;
		
		var idx = 0;
		for( var y = 0; y < level1.layers[layerIdx].height; y++ )
		{
			for( var x = 0; x < level1.layers[layerIdx].width; x++ )
			{
				if( level1.layers[layerIdx].data[idx] != 0 )
				{
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x * TILE + offsetx, (y-1) * TILE + offsety, TILESET_TILE, TILESET_TILE);
				}
			idx++;
			}
		}
	}
}

var player = new Player();
var enemy = new Enemy();
var keyboard = new Keyboard();
var viewOffset = new Vector2();

function run()
{
	context.fillStyle = "grey";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	if (Background.width != 0)
	{
		var x =	0;
		while(x * Background.width < SCREEN_WIDTH)
		{
			context.drawImage(Background, x * Background.width, 0)
			++x;
		}
	}
	
	context.save();
	if(player.position.x >= viewOffset.x + canvas.width/2)
	{
		viewOffset.x = player.position.x - canvas.width/2
	}
	
	context.translate(-viewOffset.x, 0);
	drawMap();
	
	enemy.update(deltaTime);
	enemy.draw();
	
	player.update(deltaTime);
	player.draw();
	
	context.restore();
	
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	context.fillStyle = "#f00";
	context.font="24px impact";
	context.fillText("FPS: " + fps, 5, 20, 100);
}

var sprite;
var cells = [];
function initialize()
{
	sprite = new Sprite("ChuckNorris.png");
	sprite.buildAnimation(7, 8, 165, 126, 0.05, [12, 13, 14, 15, 16, 17, 18, 19]); // builds the idle anim

	
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) 
	{
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < level1.layers[layerIdx].height; y++) 
		{
			cells[layerIdx][y] = [];
			for(var x = 0; x < level1.layers[layerIdx].width; x++) 
			{
				if(level1.layers[layerIdx].data[idx] != 0) 
				{
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				else if(cells[layerIdx][y][x] != 1) 
				{
					cells[layerIdx][y][x] = 0; 
				}
				idx++;
			}
		}
	}
}

initialize();

(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
