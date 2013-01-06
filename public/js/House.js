var House = function(loaded)
{
	this.model;
	this.loaded = loaded;
	this.model = 'models/house.obj';
	this.texture = 'models/textures/house-uv.png';
	this.init();
}

House.prototype = new Dystopia.Object3D();

House.prototype.init = function() {
	this.load();
}

House.prototype._loaded = function(model) {
	
	var self = this;
	
	this.model.position.y = 1;
	this.model.lookAt(planet.model.position);
	this.model.updateMatrix();
	this.move(new THREE.Vector3(
		toRadian(-180 + (Math.random() * 360)),
		toRadian(-180 + (Math.random() * 360)),
		toRadian(-180 + (Math.random() * 360))
	));
	
	new TWEEN.Tween({x: this.model.position.x, y: this.model.position.y, z: this.model.position.z})
	    .to({
	    	x: this.model.position.x * ((planet.radius - 2) / 1),
	    	y: this.model.position.y * ((planet.radius - 2) / 1),
	    	z: this.model.position.z * ((planet.radius - 2) / 1)
	    }, 1000)
	    .easing(TWEEN.Easing.Exponential.In)
	    .onUpdate(function () {
			self.model.position.x = this.x;
			self.model.position.y = this.y;
			self.model.position.z = this.z;
	    })
	    .start();
    
	this.loaded(model);
}

House.prototype.destroy = function() {
	
	var position = this.model.position;
	var rotation = this.model.rotation;
	
	// Replace this model with a new one
	planet.model.remove(this.model);
	this.model = 'models/tree-destroyed.obj';
	this.texture = 'models/textures/tree-destroyed-uv.png';
	this.loaded = function(model) {
		planet.model.add(model);
		model.position = position;
		model.rotation = rotation;
	}
	this.load();
	
	// This action gains 5 to the complete planet fear
	planetFear.gain(5);
}

House.prototype.positionOnPlanet = function()
{
	this.model.position.y = planet.radius - 2;
}