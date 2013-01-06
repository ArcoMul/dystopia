var SkillSet = function()
{
	var self = this;
	this.$set;
	
	this.MASK = 1;
	this.DESTROYTREE = 2;
	this.skills = {
		1: new Skills.Mask(),
		2: null,
		3: null
	}
	this._inUse = {};
	
	this.init = function()
	{
		$("body").append('<div id="skillset" class="hasInfo" data-info="Skills" />');
		this.$set = $("#skillset");
		
		this.fill();
		this.$set.css('left', ($(window).width() - this.$set.width()) / 2);
	}
	
	this.fill = function(){
		this.$set.children().remove();
		for(id in this.skills) {
			var skill = this.skills[id];
			
			var info, usage;
			if(skill !== null) {
				usage = skill.levels[skill.level].usage;
				info = 'data-info="' + usage.description + '<br><span style=\'color:#ff0000\'>Cost: ' + usage.cost + '</span><br><span style=\'color:#0000ff\'>Duration: ' + skill.getDuration() + '</span>"';
			} else {
				usage = null;
				info = null;
			}
			
			this.$set.append('<div class="skill ' + (info ? 'hasInfo hide top small' : '') + '" id="skill-' + id + '" ' + (info ? info : '') + ' />');
			var $elm = this.$set.children("#skill-" + id);
			$elm.data('id', id);
			if(skill !== null) {
				$elm.css("background-image", "url(" + skill.icon + ")");
			}
			$elm.bind('click', function(){
				skillSet.use($(this).data("id"));
			}).bind('mouseenter', function(){
				if($(this).data('info-elm')) {
					$(this).data('info-elm').show();
				}
			}).bind('mouseleave', function(){
				if($(this).data('info-elm')) {
					$(this).data('info-elm').hide();
				}
			});
		}
		
		if(assetsLoaded) {
			Info.build();
		}
	}
	
	this.activate = function(n)
	{
		console.log('SkillSet: activate');
		this.skills[n].activate();
	}
	
	this.deactivate = function(n)
	{
		console.log('SkillSet: deactivate');
		this.skills[n].deactivate();
	}
	
	this.use = function(n)
	{
		this._inUse[n] = true;
		this.skills[n].use();
	}
	
	this.unUse = function(n)
	{
		this._inUse[n] = false;
		this.skills[n].unUse();
	}
	
	this.inUse = function(n)
	{
		return this._inUse[n];
	}

}
