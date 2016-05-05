var Healthbar = function () 
{
	this.position = new Vector2();
	this.position.set( 19, 20 );
	
	this.images = [];
	this.images[0] = document.createElement("img");
	this.images[0].src = "Health Bar Full.png";
	this.images[1] = document.createElement("img");
	this.images[1].src = "Health Bar 4.png";
	this.images[2] = document.createElement("img");
	this.images[2].src = "Health Bar 3.png";
	this.images[3] = document.createElement("img");
	this.images[3].src = "Health Bar 2.png";
	this.images[4] = document.createElement("img");
	this.images[4].src = "Health Bar 1.png";
	this.images[5] = document.createElement("img");
	this.images[5].src = "Health Bar Empty.png";
	
	this.health = 5;
	this.currentImage = this.images[0];
	
	this.UpdateHealth = function(health)
	{
		if(health < 4)
		{
			this.currentImage = this.images[1];
		}
		else if(health < 3)
		{
			this.currentImage = this.images[2];
		}
		else if(health < 2)
		{
			this.currentImage = this.images[3];
		}
		else if(health < 1)
		{
			this.currentImage = this.images[4];
		}
		else if(health < 0)
		{
			this.currentImage = this.images[5];
		}
	}
	
	this.draw = function(c)
	{
		c.drawImage(this.currentImage,
			this.position.x , this.position.y);
	}
}