var WhiteHouse = function(loaded)
{
	this.model;
	this.loaded = loaded;
	this.model = 'models/white-house2.obj';
	this.texture = 'models/textures/white-house-uv.png';
	this.init();
}

WhiteHouse.prototype = new Dystopia.Object3D();

WhiteHouse.prototype.init = function() {
	this.load();
}

WhiteHouse.prototype._loaded = function(model) {
	
	var self = this;
	
	this.model.position.x = 1;
	this.model.lookAt(planet.model.position);
	this.model.updateMatrix();
	this.move(new THREE.Vector3(
		toRadian(-180 + (Math.random() * 360)),
		toRadian(-180 + (Math.random() * 360)),
		toRadian(-180 + (Math.random() * 360))
	));
	
	cameraOnWhiteHouse = true;
	
	new TWEEN.Tween({x: this.model.position.x, y: this.model.position.y, z: this.model.position.z})
	    .to({
	    	x: this.model.position.x * ((planet.radius - 2) / 1),
	    	y: this.model.position.y * ((planet.radius - 2) / 1),
	    	z: this.model.position.z * ((planet.radius - 2) / 1)
	    }, 4000)
	    .easing(TWEEN.Easing.Exponential.In)
	    .onUpdate(function () {
			self.model.position.x = this.x;
			self.model.position.y = this.y;
			self.model.position.z = this.z;
	    })
	    .onComplete(function() {
	    	cameraOnWhiteHouse = false;
	    	president = new President(function(_model){
				planet.model.add(_model);
				_model.position = model.position.clone();
				_model.rotation = model.rotation.clone();
				_model.lookAt(planet.model.position);
			})
	    })
	    .start();
    
	this.loaded(model);
}

WhiteHouse.prototype.positionOnPlanet = function()
{
	this.model.position.y = planet.radius - 2;
}