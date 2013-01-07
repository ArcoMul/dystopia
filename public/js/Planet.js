var Planet = function(loaded)
{
	var self = this;
	
	this.model;
	this.loaded = loaded;
	this.model = 'models/planet.obj';
	this.texture = 'models/textures/planet-uv.png';
	this.skyColors = {
		0: ["#DAFAFF", "#59E4FF"],
		1: ["#CFF3F8", "#4EECE0"],
		2: ["#CFF8DF", "#38D3B4"],
		3: ["#BDF1D2", "#2DBE90"],
		4: ["#A4DFBB", "#1D965C"]
	};
	this.housesActivated = false;
	this.whiteHouseActivated = false;
	
	this.radius;
	
	this.size = 1;
	
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
			self.model.children[ i ].material.map = texture;
		}
		self.setRadius();
		self.loaded(self.model);
	});
	loader.load( this.model );
}

Planet.prototype.updateFear = function()
{
	var fearFactor = Math.round(planetFear.percentage / 10);
	
	console.log("Planet set skycolor:", fearFactor);
	$("body").css("background", "-webkit-radial-gradient(center, ellipse cover, " + this.skyColors[fearFactor][0] + " 0%," + this.skyColors[fearFactor][1] + " 100%)");
}

Planet.prototype.grow = function()
{
	var self = this;
	
	var scaleFactor = 1.1 - (this.size * 0.005);
	
	if(scaleFactor <= 1.08 && $('#end-of-game').length == 0) {
		$("body").append("<img src='img/explosion.gif' id='explosion' />");
		$("body").append("<div id='end-of-game'>End of game!</div>");
		backgroundMusic.pause();
		var snd = new Audio('sound/scream.mp3');
		snd.loop = true;
		snd.play();
	}
	
	var from = {
		x: this.model.children[1].scale.x,
		y: this.model.children[1].scale.y,
		z: this.model.children[1].scale.z
	}
	var to = {
		x: from.x * scaleFactor,
		y: from.y * scaleFactor,
		z: from.z * scaleFactor
	}
	new TWEEN.Tween({x: from.x, y: from.y, z: from.z})
	    .to({x: to.x, y: to.y, z: to.z }, 1000)
	    .easing(TWEEN.Easing.Exponential.In)
	    .onUpdate(function () {
			self.model.children[1].scale.x = this.x;
			self.model.children[1].scale.y = this.y;
			self.model.children[1].scale.z = this.z;
	    })
	    .start();
	
	// Move trees
	moveObjectUpByFactor(trees, scaleFactor);
	
	// Move humans
	moveObjectUpByFactor(humans, scaleFactor);
	
	// Move clouds
	moveObjectUpByFactor(clouds, scaleFactor);
	
	// Move houses
	moveObjectUpByFactor(houses, scaleFactor);
	
	if(skillSet.inUse(skillSet.MASK)) {
		moveObjectUpByFactor([skillSet.skills[skillSet.MASK].mask], scaleFactor);
	}
	
	// Move white house(s)
	if(whiteHouse) {
		moveObjectUpByFactor([whiteHouse], scaleFactor);
	}
	
	// Move president(s)
	if(president) {
		console.log('moveObjectUpByFactor president');
		moveObjectUpByFactor([president], scaleFactor);
	}
	
	this.setRadius(this.radius * scaleFactor);
	
	if(this.model.children[1].scale.x > 1 && !this.housesActivated) {
		this.activateHouses();
	} else if (this.housesActivated && this.size % 2 == 1) {
		this.spawnHouse();
	}
	
	if(this.model.children[1].scale.x > 1.1 && !this.whiteHouseActivated) {
		this.activateWhiteHouse();
	}
	
	this.spawnTree();
	
	this.spawnHuman();
	
	this.size++;
}

Planet.prototype.setRadius = function(radius)
{
	this.radius = radius || this.model.children[1].boundRadius;
}

Planet.prototype.activateHouses = function()
{
	console.log('Planet: activate houses');
	this.housesActivated = true;
	for(var i = 0; i < 3; i++) {
		this.spawnHouse();
	}
}

Planet.prototype.activateWhiteHouse = function()
{
	console.log('Planet: activate white house');
	this.whiteHouseActivated = true;
	this.spawnWhiteHouse();
}

Planet.prototype.spawnWhiteHouse = function()
{
	whiteHouse = new WhiteHouse(function(model){
		var self = this;
		planet.model.add(model);
	});
}

Planet.prototype.spawnHouse = function()
{
	houses.push(new House(function(model){
		var self = this;
		planet.model.add(model);
		model.children[1].on('click', function(e){
			if(skillSet.inUse(skillSet.DESTROYTREE)) {
				skillSet.skills[skillSet.DESTROYTREE].destroy(self);
			}
		});
	}));
}

Planet.prototype.spawnTree = function()
{
	trees.push(new Tree(function(model){
		var self = this;
		planet.model.add(model);
		model.children[1].on('click', function(e){
			if(skillSet.inUse(skillSet.DESTROYTREE)) {
				skillSet.skills[skillSet.DESTROYTREE].destroy(self);
			}
		});
	}));
}

Planet.prototype.spawnHuman = function()
{
	humans.push(new Human(function(model){
		planet.model.add(model);
		model.position.x = planet.radius - 1;
		model.lookAt(planet.model.position);
	}));
}

var moveObjectUpByFactor = function(array, factor) {
	_.each(array, function(object) {
		new TWEEN.Tween({x: object.model.position.x, y: object.model.position.y, z: object.model.position.z})
	    .to({x: object.model.position.x * factor, y: object.model.position.y * factor, z: object.model.position.z * factor }, 1000)
	    .easing(TWEEN.Easing.Exponential.In)
	    .onStart(function() {
	    	object.mayMove = false;
	    })
	    .onUpdate(function () {
			object.model.position.x = this.x;
			object.model.position.y = this.y;
			object.model.position.z = this.z;
	    })
	    .onComplete(function() {
	    	object.mayMove = true;
	    })
	    .start();
	});
}
