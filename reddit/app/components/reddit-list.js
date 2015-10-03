import Ember from 'ember';

export default Ember.Component.extend({
	init: function() {
		Ember.$(window).keypress(Ember.run.bind(this, this.keyPress));
		this._super.apply(this);
	},
	keyPress: function(e) {
		var key = this.bindings.keyMap[e.keyCode];
		var functions = this.bindings.functions;
		if(key === functions.nextPost.getKey()) {
			this.sendAction('nextPost', e);
			return;
		}
		if(key === functions.previousPost.getKey()) {
			this.sendAction('previousPost', e);
			return;
		}
	},
	actions: {
		upVote: function() {
			this.sendAction('upVote');
		},
		downVote: function() {
			this.sendAction('downVote');
		}
	}
});
