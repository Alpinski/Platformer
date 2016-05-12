
var ANIM_IDLE_LEFT = 0;

var Enemy = function(x, y)
{
	this.scale = new Vector2(.75 ,.75)
	
		this.sprite = new Sprite("turtle.png");
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [8, 9, 10, 11, 12]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [52, 53, 54, 55, 56, 57, 58, 59]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [60, 61, 62, 63, 64]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}
	
	this.image = document.createElement("img");
	this.position = new Vector2(); 	
	this.position.set(9*TILE, 0*TILE);
	
	this.width = 159;
	this.height = 163;
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	
	this.image.src = "turtle.png";
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