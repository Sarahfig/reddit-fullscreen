import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isCurrent:current', 'isPrevious:previous', 'isNext:next'],
	isCurrent:function() {
		return this.post.isCurrent;
	}.property('post.isCurrent'),
	isPrevious: function() {
		return this.post.isPrevious;
	}.property('post.isPrevious'),
	isNext: function() {
		return this.post.isNext;
	}.property('post.isNext'),
	init: function() {
		if(this.attrs.post.value.isCurrent) {
			console.log('bind');
			Ember.$(window).keypress(Ember.run.bind(this, this.globalKeyPress));
		}
		this._super.apply(this);
	},
	globalKeyPress: function(e) {
		var key = this.bindings.keyMap[e.keyCode];
		var functions = this.bindings.functions;
		if(key === functions.upVote.getKey()) {
			this.sendAction('upVote', this.post);
			return;
		}
		if(key === functions.downVote.getKey()) {
			this.sendAction('downVote', this.post);
			return;
		}
	},
});
