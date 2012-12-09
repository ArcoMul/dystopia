// set the scene size
var WIDTH,
  	HEIGHT;

// set some camera attributes
var VIEW_ANGLE = 45,
  	ASPECT,
  	NEAR = 0.1,
  	FAR = 10000;
  	
var $container;

var controls;

var renderer, camera, scene;

var planet, tree;

var humans = [], clouds = [], fears = [], trees = [];

var EXPLORE = 1,
	SKILL = 2;
	
var state = EXPLORE;

var skillSet = new SkillSet();
skillSet.activate(skillSet.MASK);

var assetsLoaded = false;

var shop = new Shop();

var fearScore = new FearScore();
var planetFear = new PlanetFear();

function init()
{
	WIDTH = $(window).width();
  	HEIGHT = $(window).height();
  	ASPECT = WIDTH / HEIGHT;
	
	// get the DOM element to attach to
	// - assume we've got jQuery to hand
	$container = $('#container');
	
	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer({maxLights: 8});
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();
	
	// add the camera to the scene
	scene.add(camera);
	camera.position.z = 100;
	
	// THREEx stuff
	THREE.Object3D._threexDomEvent.camera(camera);
	
	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);
	$container.append(renderer.domElement);
	
	skillSet.init();
	shop.init();
	fearScore.init();
	planetFear.init();
	
	// Create planet
	planet = new Planet(function(model){
		scene.add(model);
		
		model.children[1].on('click', function(){
			console.log("Planet: click");
			
		});
		
		// Create tree
		// tree = new Tree(function(model){
			// planet.model.add(model);
			// model.position.y = planet.radius - 1;
			// model.lookAt(planet.model.position);
			// model.children[1].on('click', function(e){
				// if(skillSet.inUse(skillSet.DESTROYTREE)) {
					// skillSet.skills[skillSet.DESTROYTREE].destroy(tree);
				// }
			// });
		// });
		
		// Create trees
		for(var i = 0; i < 3; i++) {
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
		
		// Create clouds
		for(var i = 0; i < 5; i++) {
			clouds.push(new Cloud(function(model){
				scene.add(model);
				model.position.x = planet.radius + 20;
				model.lookAt(planet.model.position);
			}));
		}
		
		// Create humans
		for(var i = 0; i < 5; i++) {
			humans.push(new Human(function(model){
				planet.model.add(model);
				model.position.x = planet.radius - 1;
				model.lookAt(planet.model.position);
			}));
		}
	});
	
	controls = new THREE.TrackballControls( camera );
	
	realWindow = window.parent || window;
	realWindow.addEventListener( 'keydown', keys.event.down, false );
	realWindow.addEventListener( 'keyup', keys.event.up, false );
	
	animate();
	
}

$(window).load(function(){
	assetsLoaded = true;
	Info.build();
	
	// $(".hasTooltip").each(function(){
		// if($("#info-container").length == 0)
			// $("body").append('<div id="info-container" />')
// 		
		// var data = $(this).data("info");
		// var offset = $(this).offset();
		// $("#info-container").append('<div class="info">' + data + '<div class="arrow" /></div>');
		// $elm = $("#info-container").children().last();
		// var top;
		// var left;
		// if($(this).hasClass("right")) {
			// $elm.addClass("right");
			// top = offset.top + (($(this).height() - $elm.height()) / 2);
			// left = offset.left + $elm.width() + 20;
		// } else {
			// top = offset.top + (($(this).height() - $elm.height()) / 2);
			// left = offset.left - $elm.width() - 60;
		// }
		// $elm.css({
			// left: left,
			// top: top
		// });
	// });
	
	
});

var keys = {
	code: {
		SPACE: 32,
		W: 87,
		S: 83,
		A: 65,
		D: 68
	},
	down: {},
	update: function() {
		if(skillSet.inUse(skillSet.MASK)) {
			skillSet.skills[skillSet.MASK].keys();
		}
	},
	event: {
		down: function(e) { keys.down[e.keyCode] = true; },
		up: function(e) { keys.down[e.keyCode] = false }
	}
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	controls.update();
	
	keys.update();
	
	if(clouds.length > 0)
		for(var i = 0; i < clouds.length; i++)
			clouds[i].update();
	
	if(skillSet.inUse(skillSet.MASK)) {
		skillSet.skills[skillSet.MASK].update();
	}
	
	if(humans.length > 0)
		for(var i = 0; i < humans.length; i++)
			humans[i].update();
	
	if(fears.length > 0)
		for(var i = 0; i < fears.length; i++)
			fears[i].update();
	
	TWEEN.update();
}

function render() 
{	
	renderer.render( scene, camera );
}

function changeState(_state) {
	state = _state;
}

var toRadian = function(degrees)
{
	return degrees * Math.PI / 180;
}

var toDegrees = function(radian)
{
	return radian * 180 / Math.PI;
}

var Info = {
	build: function() {
		$(".hasInfo").each(function(){
			
			// This info box is already created, stop
			if($(this).data('info-elm')) {
				return;
			}
			
			// Create the container if in need
			if($("#info-container").length == 0)
				$("body").append('<div id="info-container" />')
			
			// The information to display in the info box
			var data = $(this).data("info");
			
			// Create the info box
			console.log(data);
			var $elm = $('<div class="info">' + data + '<div class="arrow" /></div>');
			$("#info-container").append($elm);
			
			if($(this).hasClass('small')) {
				$elm.addClass('small');
			}
			
			// Position the info box on right position
			var offset = $(this).offset();
			var top;
			var left;
			if($(this).hasClass("right")) {
				$elm.addClass("right");
				top = offset.top + (($(this).height() - $elm.height()) / 2);
				left = offset.left + $(this).outerWidth() + 20;
			} else if ($(this).hasClass("top")) {
				$elm.addClass("top");
				var arrow = $elm.children(".arrow");
				arrow.css("left", ($elm.outerWidth() - arrow.width()) / 2);
				top = offset.top - $elm.outerHeight() - 20;
				left = offset.left + (($(this).outerWidth() - $elm.outerWidth()) / 2);
			} else {
				top = offset.top + (($(this).height() - $elm.height()) / 2);
				left = offset.left - $elm.outerWidth() - 20;
			}
			$elm.css({
				left: left,
				top: top
			});
			
			if($(this).hasClass('hide')) {
				$elm.hide();
			}
			
			$(this).data('info-elm', $elm);
		});
	}
}
