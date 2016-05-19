var walkRight = 0;
var walkLeft = 1;

var Enemy = function(x, y)
{

	this.sprite = new Sprite("Runallog.png");

	this.sprite.buildAnimation(5, 3, 645, 545, 0.18, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
	this.sprite.setAnimationOffset(0, -43, -43);
	this.sprite.buildAnimation(5, 3, 645, 545, 0.18, [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
	this.sprite.setAnimationOffset(1, -43, -43);
	
	this.image = document.createElement("img");
	this.position = new Vector2(); 	
	this.position.set(9*TILE, 0*TILE);
	
	this.width = 139;
	this.height = 143;
	
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.direction = RIGHT;
	
	this.moveRight = true;
	this.pause = 0;
	
	this.image.src = "Runallog.png";
	SetupImageEvents(this, this.image);
};

Enemy.prototype.update = function(deltaTime)
{	
	this.sprite.update(deltaTime);
	if(this.pause > 0)
		{
			this.pause -= deltaTime;
		}
	else
	{
		var ddx = 0;
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE;
		var ny = (this.position.y)%TILE;
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
		
	if(this.moveRight)
	{
		if(celldiag && !cellright) 
		{
			ddx = ddx + ENEMY_ACCEL;
		}
		else 
		{
			this.velocity.x = 0;
			this.moveRight = false;
			this.pause = 0.5;
			this.sprite.setAnimation(walkLeft);
		}
	}
	if(!this.moveRight)
	{
		if(celldown && !cell) 
		{
			ddx = ddx - ENEMY_ACCEL;
		}
		else 
		{
			this.velocity.x = 0;
			this.moveRight = true;
			this.pause = 0.5;
			this.sprite.setAnimation(walkRight);
		}
		
	}
		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (deltaTime * ddx),
		-ENEMY_MAXDX, ENEMY_MAXDX);
	}
}


Enemy.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x, this.position.y)
}