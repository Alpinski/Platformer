
var ANIM_IDLE_LEFT = 0;

var Enemy = function()
{
	this.scale = new Vector2(.75 ,.75)
	
	this.image = document.createElement("img");
	this.position = new Vector2(); 	
	this.position.set(9*TILE, 0*TILE);
	
	this.width = 159;
	this.height = 163;
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	
	this.image.src = "Skeleton.png";
	SetupImageEvents(this, this.image);
};

Enemy.prototype.update = function(deltaTime)
{
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE;
	var ny = (this.position.y)%TILE;
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1)
}


Enemy.prototype.draw = function()
{
	DrawImage(context, this.image, this.position.x, this.position.y, 0, this.scale.x, this.scale.y)
}