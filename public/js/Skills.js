var Skills = {
	
	Mask: function()
	{
		this.id = 1;
		this.title = 'Mask';
		this.description = 'Scare people by running around with a mask.';
		this.icon = 'img/skills/mask.png';
		this.levels = {
			1: {
				cost: 0,
				usage: {
					description: "By using this skill a mask appears, move the mask around with WASD and scare the people with SPACEBAR",
					cost: 0,
					duration: 5
				}
			},
			2: {
				cost: 10,
				usage: {
					description: "By using this skill a mask appears, move the mask around with WASD and scare the people with SPACEBAR",
					cost: 0,
					duration: 10
				},
				gain: 'Expand your reach, scare more people at once.'
			}
		}
	
		this.level = 1;
	},
	
	DestroyTree: function()
	{
		this.id = 2;
		this.title = 'Tree Destroyer';
		this.description = 'Tree make people happy, that is not a good case. Destroy them with this Tree Destroyer. Destroying trees will increase the overall Planet Fear.';
		this.icon = 'img/skills/destroytree.png';
		this.levels = {
			1: {
				cost: 20,
				usage: {
					description: "Use the skill and click on a tree, the tree will be demolished. Planet Fear will raise.",
					cost: 5,
					duration: 0
				},
			},
		}
	}
	
}

var BaseSkill = function() {
	this.cooldown = false;
	this.level = 0;
	this.activate = function(){}
	this.use = function() {}
	this.unUse = function() {}
	this.keys = function() {}
	this.update = function() {}
	this.getDuration = function() {
		var duration;
		if(this.levels[this.level].usage.duration === 0) {
			return 'Forever';
		} else {
			return this.levels[this.level].usage.duration + ' sec.';
		}
	}
}


/*
 * Mask
 */
Skills.Mask.prototype = new BaseSkill();
		
Skills.Mask.prototype.use = function() {
	var self = this;
	
	// Create mask
	this.mask = new Mask(function(model){
		planet.model.add(model);
		model.position.x = planet.radius - 1;
		model.lookAt(planet.model.position);
		
		setTimeout(function(){ skillSet.unUse(skillSet.MASK) }, self.levels[self.level].usage.duration * 1000);
	});
}

Skills.Mask.prototype.unUse = function(){
	planet.model.remove(this.mask.model);
	this.mask = null;
}

Skills.Mask.prototype.keys = function()
{
	if(keys.down[keys.code.W]) {
		this.mask.moveForward();
	}
	if(keys.down[keys.code.S]) {
		this.mask.moveBackward();
	}
	if(keys.down[keys.code.D]) {
		this.mask.turnRight();
	}
	if(keys.down[keys.code.A]) {
		this.mask.turnLeft();
	}
	if(keys.down[keys.code.SPACE]) {
		this.scare();
	}
}

Skills.Mask.prototype.update = function()
{
	if(this.mask)
	{
		this.mask.update();
		
		camera.position = this.mask.model.position.clone().multiplyScalar(6);
		camera.lookAt(this.mask.model.position);
	}
}

Skills.Mask.prototype.scare = function()
{
	if(this.cooldown) {
		return;
	}
	var self = this;
	
	console.log('Mask: scare');
	for(var i = 0; i < humans.length; i++) {
		var distance = humans[i].model.position.distanceTo(this.mask.model.position);
		if(distance < 10) {
			humans[i].scare(2);
		}
	}
	
	this.cooldown = true;
	
	setTimeout(function(){
		self.cooldown = false;
	}, 1000)
}

/**
 * Tree Destroyer
 */
Skills.DestroyTree.prototype = new BaseSkill();

Skills.DestroyTree.prototype.destroy = function(tree) {
	if(fearScore.score < this.levels[this.level].usage.cost) {
		return;
	}
	tree.destroy();
	fearScore.add(-this.levels[this.level].usage.cost);
}