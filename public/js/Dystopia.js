var Dystopia = {
	Object3D: function()
	{
		this.opacity = 1;
		this.mayMove = true;
		
		this.load = function()
		{
			var self = this;
			
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
					self.model.children[i].material.map = texture;
					// self.model.children[i].material.map.generateMipmaps = false;
					self.model.children[i].material.opacity = self.opacity;
				}
				self._loaded(self.model);
			});
			loader.load( this.model );
		}
		
		this._loaded = function(model) { this.loaded(model); }
		
		this.move = function(direction, axis) {
			if(!this.mayMove) {
				return false;
			}
			axis = axis || "XYZ";
			var m4 = new THREE.Matrix4().setRotationFromEuler(direction, axis);
			m4.multiplySelf(this.model.matrix);
			this.model.matrix = m4;
			this.model.position.getPositionFromMatrix(m4);
			this.model.rotation.setEulerFromRotationMatrix(m4);
		}
	}
}
