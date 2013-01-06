var President = function(loaded)
{
	this.model;
	this.loaded = loaded;
	this.model = 'models/human.obj';
	this.texture = 'models/textures/human-uv.png';
	this.startPosition = false;
	this.isScared = false;
	this.guards = [];
	
	this.init();
}

President.prototype = new Dystopia.Object3D();

President.prototype.init = function()
{
	this.load();
}

President.prototype._loaded = function(model)
{
	var self = this;
	
	// The blue material
	var blueMat = new THREE.MeshBasicMaterial({color: 0x5b89ff});
	
	// Give all its meshes the right materail / color
	for(var i = 0; i < model.children.length; i++) {
		model.children[i].material = blueMat;
	}
	
	for(var i = 0; i < 2; i++) {
		this.guards.push(new Guard(function(_model) {
			self.model.add(_model);
			_model.position = model.position.clone();
			_model.rotation = model.rotation.clone();
			_model.position.x += -1 + (i * 2);
			_model.lookAt(planet.model.position);
		}));
	}
	
	this.loaded(model);
}

President.prototype.update = function()
{
	var self = this;
		_.each(trees, function(tree) {
			var distance = tree.model.position.distanceTo(self.model.position);
			if(distance < 10 && tree.isDestroyed) {
				tree.heal();
			}
		});
	
	if(this.direction && this.model.position && this.model.rotation && this.startPosition)
	{
		this.move(this.direction);
	}
	
	if(this.model.position && !this.startPosition)
	{
		this.direction = new THREE.Vector3(toRadian(-0.5 + (Math.random() * 1)), toRadian(-0.5 + (Math.random() * 1)), toRadian(-0.5 + (Math.random() * 1)));
		this.startPosition = true;
	}
}

President.prototype.dropFear = function()
{
	console.log('Human: drop fear');
	
	var self = this;
	
	planetFear.add(1);
	
	fears.push(new Fear(function(model){
		planet.model.add(model);
		model.position = self.model.position.clone();
		model.lookAt(planet.model.position);
	}))
}

President.prototype.scare = function(n)
{
	console.log('Human: scare');
	var self = this;
	
	if(this.isScared) {
		return;
	}
	
	// Define that this human is scared at the moment
	this.isScared = true;
	
	// Whether the human is blue at the mometn
	var blue = false;
	
	// The original material
	var material = this.model.children[0].material;
	
	// The blue material
	var blueMat = new THREE.MeshBasicMaterial({color: 0x5b89ff});
	
	var count = 0;
	var interval = setInterval(function(){
		// After four times kill the interval
		if(count == n * 2) {
			clearInterval(interval);
			self.isScared = false;
			return;
		}
		// If the human is blue make him normal
		if(blue) {
			var mat = material;
			blue = false;
		// If the human is not blue make him blue and let drop one fear
		} else {
			var mat = blueMat;
			blue = true;
			self.dropFear();
		}
		
		// Give all its meshes the right materail / color
		for(var i = 0; i < self.model.children.length; i++) {
			self.model.children[i].material = mat;
		}
		count++;
	}, 500);
	
	
}
