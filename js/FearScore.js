var FearScore = function()
{
	var self = this;
	this.$container;
	this.$score;
	this.score = 0;
	
	this.init = function()
	{
		$("body").append('<div id="score-fear" class="hasInfo" data-info="Collected Fear"><img src="img/fear.png" /><span /></div>');
		this.$container = $("#score-fear");
		this.$score = this.$container.children('span');
		this.set(this.score);
	}
	
	this.set = function(n)
	{
		this.$score.text(n);
	}
	
	this.add = function(n)
	{
		this.score += n;
		this.set(this.score);
	}

}
