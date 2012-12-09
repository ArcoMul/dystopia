var Planet = function(loaded)
{
	var self = this;
	
	this.model;
	this.loaded = loaded;
	this.model = 'models/planet.obj';
	this.texture = 'models/textures/planet-uv.png';
	this.skyColors = {
		0: ["#DAFAFF", "#59E4FF"],
		1: ["#CFF3F8", "#4EECE0"],
		2: ["#CFF8DF", "#38D3B4"],
		3: ["#BDF1D2", "#2DBE90"],
		4: ["#A4DFBB", "#1D965C"]
	};
	
	this.radius;
	
	var texture = new THREE.Texture();
	var loader = new THREE.ImageLoader();
	loader.addEventListener( 'load', function ( event ) {
		texture.image = event.content;
		texture.needsUpdate = true;
	});
	loader.load( this.texture );
	
	var loader = new THREE.OBJLoader();
	loader.addEventListener( 'load', function ( event ) {
		self.model = event.content;
		for ( var i = 0, l = self.model.children.length; i < l; i ++ ) {
			self.model.children[ i ].material.map = texture;
		}
		self.radius = self.model.children[0].boundRadius;
		self.loaded(self.model);
	});
	loader.load( this.model );
}

Planet.prototype.updateFear = function()
{
	var fearFactor = Math.round(planetFear.percentage / 10);
	
	console.log("Planet set skycolor:", fearFactor);
	$("body").css("background", "-webkit-radial-gradient(center, ellipse cover, " + this.skyColors[fearFactor][0] + " 0%," + this.skyColors[fearFactor][1] + " 100%)");
}
