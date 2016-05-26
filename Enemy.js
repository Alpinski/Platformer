var walkRight = 0;
var walkLeft = 1;

var Enemy = function(x, y)
{

	this.sprite = new Sprite("monsterLR.png");

	this.sprite.buildAnimation(1, 2, 110, 99, 0.5, [0]);
	this.sprite.setAnimationOffset(0, -43, -53);
	this.sprite.buildAnimation(5, 3, 110, 99, 0.5, [1]);
	this.sprite.setAnimationOffset(1, -43, -53);
	
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
	
	this.image.src = "monsterLR.png";
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