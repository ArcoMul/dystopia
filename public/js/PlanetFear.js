var PlanetFear = function()
{
	var self = this;
	this.$container;
	this.$percentage;
	this.percentage = 0;
	
	this.max = 100;
	this.gained = 0;
	
	this.init = function()
	{
		var self = this;
		
		$("body").append('<div id="planet-fear" class="hasInfo right" data-info="Planet Fear"><span /></div>');
		this.$container = $("#planet-fear");
		this.$percentage = this.$container.children('span');
		this.set(this.percentage);
		
		setInterval(function(){
			// Remove some of the planet fear
			self.drain();
		}, 2000);
		
		this.totalScare = setInterval(this.scarePlanet, 2000);
	}
		
	this.set = function(n)
	{
		this.$percentage.text(n + "%");
	}
	
	this.add = function(n)
	{
		this.percentage += n;
		this.set(this.percentage);
		planet.updateFear();
	}
	
	this.drain = function()
	{
		if(this.percentage > ((this.gained / this.max) * 100)) {
			this.add(-1);
			planet.updateFear();
		}
	}
	
	this.gain = function(n)
	{
		this.gained += n;
		this.add(n);
	}
	
	this.scarePlanet = function() {
		if(self.percentage > 0) {
			for(var i = 0; i < humans.length; i++) {
				humans[i].scare(1);
			}
		}
		if(self.totalScare) {
			clearInterval(self.totalScare);
		}
		console.log("Set total planet scare:", (150 - self.percentage) * 100);
		self.totalScare = setInterval(self.scarePlanet, (150 - self.percentage) * 100);
	}

}
