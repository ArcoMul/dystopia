var Shop = function()
{
	var self = this;
	this.$button
	
	this.init = function()
	{
		var self = this;
		
		$("body").append('<div id="shop-button" class="hasInfo right" data-info="Shop"><div /></div>');
		this.$buttonContainer = $("#shop-button");
		this.$button = this.$buttonContainer.children('div');
		this.$buttonContainer.css({
			left: skillSet.$set.offset().left + skillSet.$set.width() + 20,
			top: skillSet.$set.offset().top
		});
		
		// Add base element of the shop, the container
		$("body").append('<div id="shop"><div class="content"><h2>Shop</h2><div class="close">x</div></div></div>');
		this.$container = $("#shop");
		
		// Set up the holder for the content of the shop
		var content = this.$container.children(".content");
		content.append('<div class="left" /><div class="right" />');
		content.css({
			height: ($(window).height() - 100) * 0.7,
			width: 800
		}).children(".left").css("height", content.height() - content.children('h2').outerHeight());
		this.$container.css({
			top: ($(window).height() - this.$container.height()) / 2,
			left: ($(window).width() - this.$container.width()) / 2
		}).hide()
		this.fill();
		
		
		var closeButton = content.children(".close");
		closeButton.bind('click', function(){
			self.close();
		});
		
		this.$button.click(function(){
			self.open();
		});
	}
	
	this.open = function() {
		console.log("Shop: open");
		this.fill();
		this.$container.show();
	}
	
	this.close = function() {
		console.log("Shop: close");
		this.$container.hide();
	}

	this.fill = function() {
		console.log("Shop: fill");
		var content = this.$container.children(".content");
		
		var left = content.children(".left");
		left.children().remove();
		for(pos in skillSet.skills) {
			if(skillSet.skills[pos]) {
				left.append(this.createSkillTile(skillSet.skills[pos]));
			}
		}
		
		var right = content.children(".right");
		right.children().remove();
		for(skill in Skills) {
			var skill = new Skills[skill]();
			
			var hasSkill = false;
			for(pos in skillSet.skills) {
				if(skillSet.skills[pos] && skillSet.skills[pos].title == skill.title) {
					hasSkill = true;
				}
			}
			right.append(this.createSkillTile(skill, true, hasSkill));
		}
	}
	
	this.buy = function(skill) {
		skill.level = 1;
		skillSet.skills[skill.id] = skill;
		skillSet.fill();
		fearScore.add(-skill.levels[skill.level].cost);
		this.fill();
	}
	
	this.createSkillTile = function(skill, buy, fade) {
		
		if(!buy && !skill.levels[skill.level + 1]) {
			return;
		}
		
		// Amount of fear this item costs
		var cost = skill.levels[(buy ? 1 : skill.level + 1)].cost;
		
		var tile = $('<div class="skill ' + (fade ? 'bought' : '') + '" />');
		tile.append('<div class="img"><img src="' + skill.icon + '" /></div>')
		
		var info = tile.append('<div class="info" />').children(".info");
		info.append('<h3>' + skill.title + '</h3>');
		info.append('<p>' + skill.description + '</p>');
		if(!buy) {
			info.append('<p><span style="color:#0000ff">' + skill.levels[skill.level + 1].gain + '</span></p>');
		}
		info.append('<p><span style="color:#ff0000">' + cost + ' Fear' + (cost > fearScore.score ? ' (not enough Fear)' : '') + '</span></p>');
		
		tile.append('<button>' + (buy ? 'Buy' : 'Upgrade') + '</button>');
		var button = tile.children('button');
		button.data('skill', skill);
		button.bind('click', function(e){
			e.preventDefault();
			if(!$(this).hasClass('no-click')) {
				shop.close();
				shop.buy($(this).data('skill'));
			}
		});
		if(cost > fearScore.score) {
			button.addClass('no-click');
		}
		tile.append('<br class="clear">');
		return tile;
	}
}
