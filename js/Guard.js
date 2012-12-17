var Guard = function(loaded)
{
	this.model;
	this.loaded = loaded;
	this.model = 'models/human.obj';
	this.texture = 'models/textures/human-uv.png';
	this.startPosition = false;
	this.isScared = false;
	this.init();
}

Guard.prototype = new Dystopia.Object3D();

Guard.prototype.init = function()
{
	this.load();
}

Guard.prototype._loaded = function(model)
{
	// The blue material
	var mat = new THREE.MeshBasicMaterial({color: 0x222222});
	
	// Give all its meshes the right materail / color
	for(var i = 0; i < model.children.length; i++) {
		model.children[i].material = mat;
	}
	
	this.loaded(model);
}

Guard.prototype.update = function()
{
	
}