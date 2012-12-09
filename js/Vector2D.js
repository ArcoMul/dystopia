var Vector2D = function(x, y)
{
	this.x = x;
	this.y = y;
	
	this.rotate = function(degrees)
	{
		var x = (this.x * Math.cos(toRadian(degrees))) - (this.y * Math.sin(toRadian(degrees)));
		var y = (this.x * Math.sin(toRadian(degrees))) + (this.y * Math.cos(toRadian(degrees)));
		return new Vector2D(x, y);
	}
	
	this.add = function(vector)
	{
		return new Vector2D(this.x + vector.x, this.y + vector.y);
	}
	
	this.substract = function(vector)
	{
		return new Vector2D(this.x - vector.x, this.y - vector.y);
	}
	
	this.isZero = function()
	{
		return this.x === 0 && this.y === 0;
	}
	
	this.workToZero = function(step)
	{
		this.x = workToZero(this.x, step);
		this.y = workToZero(this.y, step);
	}
}