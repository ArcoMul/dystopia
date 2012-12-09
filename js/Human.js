var Human = function(loaded)
{
	this.model;
	this.loaded = loaded;
	this.model = 'models/human.obj';
	this.texture = 'models/textures/human-uv.png';
	this.startPosition = false;
	this.isScared = false;
	this.init();
}

Human.prototype = new Dystopia.Object3D();

Human.prototype.init = function()
{
	this.load();
}

Human.prototype.update = function()
{
	
	if(this.direction && this.model.position && this.model.rotation && this.startPosition)
	{
		this.move(this.direction);
	}
	
	if(this.model.position && !this.startPosition)
	{
		this.move(new THREE.Vector3(
			toRadian(-180 + (Math.random() * 360)),
			toRadian(-180 + (Math.random() * 360)),
			toRadian(-180 + (Math.random() * 360))
		));
		this.direction = new THREE.Vector3(toRadian(-0.5 + (Math.random() * 1)), toRadian(-0.5 + (Math.random() * 1)), toRadian(-0.5 + (Math.random() * 1)));
		this.startPosition = true;
	}
}

Human.prototype.dropFear = function()
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

Human.prototype.scare = function(n)
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
