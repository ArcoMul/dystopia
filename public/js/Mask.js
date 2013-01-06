var Mask = function(loaded)
{
	this.model;
	this.loaded = loaded;
	
	this.model = 'models/mask.obj';
	this.texture = 'models/textures/mask-uv.png';
	
	this.turnX = 0;
	this.turnY = 0;
	
	this.mayMove = true;
	
	this.init();
}

Mask.prototype = new Dystopia.Object3D();

Mask.prototype.init = function() {
	this.load();
}

Mask.prototype.update = function() {
	if(this.speed > 0) {
		this.model.position.x += this.speed;
		this.speed -= 1;
	}
}

Mask.prototype.moveForward = function() {
	
	if(!this.mayMove) {
		return;
	}
	
	// Move the bloody thing forward
	this.move(new THREE.Vector3(toRadian(this.turnX), toRadian(this.turnY), toRadian(1)));
	
	// Reset
	this.turnX = 0;
	this.turnY = 0;
}
	
Mask.prototype.moveBackward = function() {
	
	if(!this.mayMove) {
		return;
	}
	
	this.move(new THREE.Vector3(toRadian(this.turnX), toRadian(this.turnY), toRadian(-1)));
}

Mask.prototype.turnRight =  function() {
	this.turnX = 1;
}
	
Mask.prototype.turnLeft = function() {
	this.turnY = 1;
}