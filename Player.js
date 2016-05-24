var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_MAX = 6;

var Player = function() 
{
	this.cooldownTimer = 0;
	
	this.scale = new Vector2(0.5 ,0.5)

	this.sprite = new Sprite("SwordsmanIdleRight.png");
	
	this.sprites = [];
	
	this.sprites[ANIM_IDLE_RIGHT] = new Sprite("SwordsmanIdleRight.png");
	this.sprites[ANIM_IDLE_RIGHT].buildAnimation(5, 7, 162, 162, 0.05, [34, 32, 30, 24, 22, 20, 14, 12, 10, 4, 2, 0]);
	this.sprites[ANIM_IDLE_RIGHT].setAnimationOffset( 0, -30, -115);
	
	this.sprite = new Sprite("SwordsmanIdleL.png");
	this.sprites[ANIM_IDLE_LEFT] = new Sprite("SwordsmanIdleL.png")
	this.sprites[ANIM_IDLE_LEFT].buildAnimation(5, 7, 162, 162, 0.05, [0, 2, 4, 10, 12, 14, 20, 22, 24, 30, 32, 34]);
	this.sprites[ANIM_IDLE_LEFT].setAnimationOffset( 0, -30, -115);
	
	this.sprite = new Sprite("Runright.png");
	this.sprites[ANIM_WALK_RIGHT] = new Sprite("Runright.png")
	this.sprites[ANIM_WALK_RIGHT].buildAnimation(5, 7, 162, 162, 0.05, [0, 2, 4, 10, 12, 14, 20, 22, 24, 30, 32, 34]);
	this.sprites[ANIM_WALK_RIGHT].setAnimationOffset( 0, -30, -115);
	
	this.sprite = new Sprite("Runleft.png");
	this.sprites[ANIM_WALK_LEFT] = new Sprite("Runleft.png")
	this.sprites[ANIM_WALK_LEFT].buildAnimation(5, 7, 162, 162, 0.05, [0, 2, 4, 10, 12, 14, 20, 22, 24, 30, 32, 34]);
	this.sprites[ANIM_WALK_LEFT].setAnimationOffset( 0, -30, -115);
	
	

	this.image = document.createElement("img");
	this.position = new Vector2(); 	
	this.position.set(1*TILE, 9*TILE);
	
	this.width = 540;
	this.height = 536;
	
	this.animState = ANIM_IDLE_RIGHT
	
	this.velocity = new Vector2();
	
	this.direction = LEFT;
	
	this.falling = true;
	this.jumping = false;

	SetupImageEvents(this, this.image);
};

Player.prototype.update = function(deltaTime)
{
	this.sprites[this.animState].update(deltaTime);
	
	var left = false;
	var right = false;
	var jump = false;
	
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
	{
		left = true;
		this.direction = LEFT;
		if(this.animState != ANIM_WALK_LEFT &&
			this.jumping == false)
			this.animState = ANIM_WALK_LEFT;
	}

	else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) 
	{
		right = true;
		this.direction = RIGHT;
		if(this.animState != ANIM_WALK_RIGHT &&
			this.jumping == false)
			this.animState = ANIM_WALK_RIGHT
	}
	
	else 
	{
		if(this.jumping == false && this.falling == false)
		{
			if(this.direction == LEFT)
			{	
				if(this.animState != ANIM_IDLE_LEFT)
				this.animState = ANIM_IDLE_LEFT;
			}
			else
			{
				if(this.animState != ANIM_IDLE_RIGHT)
					this.animState = ANIM_IDLE_RIGHT;
			}
		}
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		iShoot = true;
	}
		else
	{
		iShoot = false;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_UP) == true) 
	{
		jump = true;
	}
	if(this.cooldownTimer > 0)
	{
		this.cooldownTimer -= deltaTime;
	}
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true && this.cooldownTimer <= 0) 
	{
		sfxFire.play();
		this.cooldownTimer = 0.3;
	}

	
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var falling = this.falling;
	var ddx = 0;
	var ddy = GRAVITY;
	
	if (left)
			ddx = ddx - ACCEL;
		else if (wasleft)
			ddx = ddx + FRICTION;
		
	if (right)
			ddx = ddx + ACCEL;
		else if (wasright)
			ddx = ddx - FRICTION;
		
	if (jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP;
		this.jumping = true;
		if(this.direction == LEFT)
			this.sprite.setAnimation(ANIM_JUMP_LEFT)
		else
			this.sprite.setAnimation(ANIM_JUMP_RIGHT)
		}
		
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE;
	var ny = (this.position.y)%TILE;
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1)
	
	
	if ((wasleft && (this.velocity.x > 0)) || (wasright && (this.velocity.x < 0)))
	{
		this.velocity.x = 0; 
	}
	
	if (this.velocity.y > 0)
	{
		if ((celldown && !cell) || (celldiag && !cellright && nx))
		{
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			this.falling = false;
			this.jumping = false;
			ny = 0;
		}
	}
	 
	else if (this.velocity.y < 0)
	{
		if ((cell && !celldown) || (cellright && !celldiag && nx))
		{
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0;
			cell = celldown;
			cellright = celldiag;
			ny = 0;
		}
	}
	
	if (this.velocity.x > 0)
	{
	if ((cellright && !cell) || (celldiag && !celldown && ny))
		{
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
		}
	}
	
	else if (this.velocity.x < 0) 
	{
	if ((cell && !cellright) || (celldown && !celldiag && ny)) 
		{
		this.position.x = tileToPixel(tx + 1);
		this.velocity.x = 0;
		}
	}

	player.falling = ! (celldown || (nx && celldiag));
}

Player.prototype.draw = function()
{
	this.sprites[this.animState].draw(context, this.position.x, this.position.y);
}