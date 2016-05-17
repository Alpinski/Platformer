
var ANIM_WALK_RIGHT = 5;
var ANIM_WALK_LEFT = 2;

var Enemy = function(x, y)
{
	this.sprite = new Sprite("turtle3.png");

	this.sprite.buildAnimation(11, 4, 139, 143, 0.25, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
	this.sprite.buildAnimation(11, 4, 139, 143, 0.25, [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ]);
	this.sprite.setAnimationOffset(0, -43, -43);
	
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
	
	this.image.src = "turtle.png";
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
		var ddx = 0; // acceleration
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE; // true if enemy overlaps right
		var ny = (this.position.y)%TILE; // true if enemy overlaps below
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
		if(this.moveRight)
	{
		if(celldiag && !cellright) 
		{
			ddx = ddx + ENEMY_ACCEL; // enemy wants to go right
		}
		else 
		{
			this.velocity.x = 0;
			this.moveRight = false;
			this.pause = 0.5;
		}
	}
	if(!this.moveRight)
	{
		if(celldown && !cell) 
		{
			ddx = ddx - ENEMY_ACCEL; // enemy wants to go left
		}
		else 
		{
			this.velocity.x = 0;
			this.moveRight = true;
			this.pause = 0.5;
		}
	}
		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (deltaTime * ddx),
		-ENEMY_MAXDX, ENEMY_MAXDX);
	}
}


Enemy.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x, this.position.y);
}