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

var STATE_SPLASH = 0;
var STATE_CONTROLS = 1;
var STATE_GAME = 2;
var STATE_GAMEOVER = 3;

var gameState = STATE_SPLASH;

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
	var bullet = new Bullet(player.position.x, player.position.y, player.direction == RIGHT)
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

var playerScore = 0;
var enterPressed = false;

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

var ENEMY_MAXDX = METER * 2;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var enemies = [];

var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;

var lives = 5;

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
var keyboard = new Keyboard();
var viewOffset = new Vector2();
var Healthbar = new Healthbar();
var bullet = new Bullet();

var bullets = [];
var iShoot = false;
var shootTimer = 0;
var shootRate = 0.3;
function runSplash(deltaTime)
{
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true)
	{
		enterPressed = true
		gameState = STATE_CONTROLS
	}
	context.fillStyle = "#33ccff";
	context.font = "128px impact";
	context.textBaseline = "bottom";
	context.fillText("Bounce", 750, 500);
	context.font = "52px impact"
	context.fillText("PRESS ENTER", 815, 700)
}

function runControls(deltaTime)
{
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true)
	{
		if (enterPressed == false)
		gameState = STATE_GAME
	}
	
	else
	{
		enterPressed = false
	}
	
	context.fillStyle = "#33ccff";
	context.font="128px impact";
	context.textBaseline = "bottom";
	context.fillText("CONTROLS", 675, 150);
	context.font="72px impact";
	context.fillText("ARROW KEYS = MOVEMENT AND JUMP", 425, 275)
	context.fillText("SPACE = SHOOT", 425, 400)
	context.fillText("ENTER = ADVANCE TO GAME", 425, 900)
}

function runGame(deltaTime)
{
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

	
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		bullets[i].draw();
	}
	
	player.update(deltaTime);
	player.draw();
	
	Healthbar.UpdateHealth();
	Healthbar.draw(context)
	
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
	context.fillText("FPS: " + fps, 1825, 875, 100);
	
	context.fillStyle = "rgba(55, 55, 55, 0.75)"
	context.fillStyle = "green";
	context.font = "52px impact";
	context.textBaseline = "top";
	context.fillText(playerScore, 900,10);
	
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
	}
 
	if(iShoot && shootTimer <= 0)
	{
		shootTimer = shootRate;
		playerShoot();
	}
		
	if(shootTimer > 0)
	shootTimer -= deltaTime;
}

function runGameOver(deltaTime)
{
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true)
	{
		gameState = STATE_SPLASH
	}
	context.fillStyle = "green";
	context.font = "128px impact";
	context.textBaseline = "middle";
	context.fillText("GAME OVER", 655, 375);
	context.fillText(playerScore, 890, 520);
	context.font = "52px impact";
	context.fillText("PRESS ENTER", 815, 900)
}

function run()
{
	context.fillStyle = "grey";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	
		{
			case STATE_SPLASH:
				runSplash(deltaTime);
				break;
			case STATE_CONTROLS:
				runControls(deltaTime);
				break;
			case STATE_GAME:
				runGame(deltaTime);
				break;
			case STATE_GAMEOVER:
				runGameOver(deltaTime);
				break;
		}
}

var sprite;
var cells = [];
var musicBackground;
var sfxFire;
function initialize()
{
	sprite = new Sprite("SwordsmanIdle.png");
	sprite.buildAnimation(3, 4, 537, 531, 0.05, [0, 2, 4, 10, 12, 14, 20, 22, 24, 30, 32, 34]); // builds the idle anim

	
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
	musicBackground = new Howl(
	{
		urls: ["background.ogg"],
		loop: true,
		buffer: true,
		volume: 0.5
	} );
	musicBackground.play();
	
	sfxFire = new Howl
	(
		{
			urls: ["fireEffect.ogg"],
			buffer: true,
			volume: 1,
			onend: function() 
			{
				isSfxPlaying = false;
			}
		}
	)
	
	idx = 0;
	for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++)
	{
		for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++)
		{
			if(level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0)
			{
				var px = tileToPixel(x);
				var py = tileToPixel(y);
				var e = new Enemy(px, py);
				enemies.push(e);
			}
			idx++;
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
