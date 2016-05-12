var Bullet = function(x, y, moveRight)
{
	this.sprite = new Sprite("Bullet.png");
	this.sprite.buildAnimation(1, 1, 32, 32, -1, [0]);
	this.sprite.setAnimationOffset(0, 45, 5);
	this.sprite.setLoop(0, false);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.moveRight = moveRight;
	if(this.moveRight == true)
		this.velocity.set(MAXDX *2, 0);
	else
		this.velocity.set(-MAXDX *2, 0);
}

Bullet.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
}

Bullet.prototype.draw = function()
{
	var screenX = this.position.x;
	this.sprite.draw(context, screenX, this.position.y);
}