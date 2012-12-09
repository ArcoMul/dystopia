var Tree = function(loaded)
{
	this.model;
	this.loaded = loaded;
	this.model = 'models/tree.obj';
	this.texture = 'models/textures/tree-uv.png';
	this.init();
}

Tree.prototype = new Dystopia.Object3D();

Tree.prototype.init = function() {
	this.load();
}

Tree.prototype._loaded = function(model) {
	
	this.model.position.y = planet.radius - 1;
	this.model.lookAt(planet.model.position);
	this.model.updateMatrix();
	this.move(new THREE.Vector3(
		toRadian(-180 + (Math.random() * 360)),
		toRadian(-180 + (Math.random() * 360)),
		toRadian(-180 + (Math.random() * 360))
	));
	this.loaded(model);
}

Tree.prototype.destroy = function() {
	
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

