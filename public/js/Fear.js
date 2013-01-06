var Fear = function(loaded)
{
	this.model;
	this.loaded = loaded;
	this.model = 'models/fear.obj';
	this.texture = 'models/textures/fear-uv.png';
	this.startPosition = false;
	this.init();
}

Fear.prototype = new Dystopia.Object3D();

Fear.prototype.init = function()
{
	this.load();
}

Fear.prototype._loaded = function(model)
{
	var self = this;
	setTimeout(function(){
		var up = self.model.position.clone().multiplyScalar(10);
		var tween = new TWEEN.Tween({x: self.model.position.x, y: self.model.position.y, z: self.model.position.z})
        .to({x: up.x, y: up.y, z: up.z }, 4000)
        .easing(TWEEN.Easing.Exponential.In)
        .onUpdate(function () {
			self.model.position.x = this.x;
			self.model.position.y = this.y;
			self.model.position.z = this.z;
        })
        .onComplete(function(){
        	planet.model.remove(self.model);
        })
        .start();
	}, 1000);
	setTimeout(function(){
		fearScore.add(1);
	}, 5000);
	
	this.loaded(model);
}

Fear.prototype.update = function()
{
	
}
