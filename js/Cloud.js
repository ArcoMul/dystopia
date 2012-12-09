var Cloud = function(loaded)
{
	this.model;
	this.loaded = loaded;
	this.model = 'models/cloud.obj';
	this.texture = 'models/textures/cloud-uv.png';
	this.opacity = 0.5;
	this.startPosition = false;
	this.direction;
	this.init();
}

Cloud.prototype = new Dystopia.Object3D();

Cloud.prototype.init = function() {
	this.load();
}

Cloud.prototype._loaded = function(model) {
	this.model.alpha = 0.5;
	this.loaded(model);
}

Cloud.prototype.update = function() {
	
	if(this.direction && this.model.position && this.model.rotation && this.startPosition) {
		this.move(this.direction);
	}
	
	if(this.model.position && !this.startPosition)
	{
		this.move(new THREE.Vector3(
			toRadian(-180 + (Math.random() * 360)),
			toRadian(-180 + (Math.random() * 360)),
			toRadian(-180 + (Math.random() * 360))
		));
		this.direction = new THREE.Vector3(toRadian(-0.1 + (Math.random() * 0.2)), toRadian(-0.1 + (Math.random() * 0.2)), toRadian(-0.1 + (Math.random() * 0.2)));
		this.startPosition = true;
	}
	
	// if(this.model.position)
	// {
		// var v2 = new Vector2D(this.model.position.x, this.model.position.y);
		// v2 = v2.rotate(0.1);
		// this.model.position.x = v2.x, this.model.position.y = v2.y;
		// this.model.rotation.y += toRadian(0.1);
	// }
}

