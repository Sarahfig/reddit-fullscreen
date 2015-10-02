import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isCurrent:current', 'isPrevious:previous', 'isNext:next', 'isUpVoted:upvoted', 'isDownVoted:downvoted'],
	isCurrent:function() {
		return this.get('post.isCurrent');
	}.property('post.isCurrent'),
	isPrevious: function() {
		return this.get('post.isPrevious');
	}.property('post.isPrevious'),
	isNext: function() {
		return this.get('post.isNext');
	}.property('post.isNext'),
	isUpVoted: function() {
		console.log('checkupvoted');
		return this.get('post.isUpVoted');
	}.property('post.isUpVoted'),
	isDownVoted: function() {
		return this.get('post.isDownVoted');
	}.property('post.isDownVoted'),
	init: function() {
		if(this.attrs.post.value.isCurrent) {
			console.log('bind');
			Ember.$(window).keypress(Ember.run.bind(this, this.globalKeyPress));
		}
		this._super.apply(this);
	},
	globalKeyPress: function(e) {
		console.log('keypress', this, this.get('post'));
		var key = this.bindings.keyMap[e.keyCode];
		var functions = this.bindings.functions;
		if(key === functions.upVote.getKey()) {
			this.sendAction('upVote', this.get('post'));
			if(this.get('post.isUpVoted')) {
				this.set('post.isUpVoted', false);
			} else {
				this.set('post.isUpVoted', true);
			}
			this.set('post.isDownVoted', false);
			console.log('sent', this.get('post'));
			return;
		}
		if(key === functions.downVote.getKey()) {
			this.sendAction('downVote', this.get('post'));
			if(this.get('post.isDownVoted')) {
				this.set('post.isDownVoted', false);
			} else {
				this.set('post.isDownVoted', true);
			}
			this.set('post.isUpVoted', false);
			console.log('sent', this.get('post'));
			return;
		}
	},
});
