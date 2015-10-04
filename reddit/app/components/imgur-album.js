import Ember from 'ember';

export default Ember.Component.extend({
	currentIndex: 0,
	currentNumber: function() {
		return this.get('currentIndex') + 1;
	}.property('currentIndex'),
	currentImage: function() {
		var album = this.get('album');
		return album[this.get('currentIndex')];
	}.property('currentIndex', 'album'),
	totalImages: function() {
		return this.get('album').length;
	}.property('album'),
	init: function() {
		Ember.$(window).bind('keypress', Ember.run.bind(this, this.globalKeyPress));
		this._super.apply(this);
	},
	globalKeyPress: function(e) {
		if(!this.get('album')) {
			return;
		}
		var key = this.bindings.keyMap[e.keyCode];
		var functions = this.bindings.functions;
		var currentIndex = this.get('currentIndex');
		var totalImages = this.get('totalImages');
		if(key === functions.nextImage.getKey()) {
			var next;
			if(currentIndex === totalImages - 1) {
				next = 0;
			} else {
				next = currentIndex + 1;
			}
			this.set('currentIndex', next);
		}
		if(key === functions.previousImage.getKey()) {
			var previous;
			if(currentIndex === 0) {
				previous = totalImages - 1;
			} else {
				previous = currentIndex - 1;
			}
			this.set('currentIndex', previous);
		}
	},
});
