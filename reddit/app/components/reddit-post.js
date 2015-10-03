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
		return this.get('post.isUpVoted');
	}.property('post.isUpVoted'),
	isDownVoted: function() {
		return this.get('post.isDownVoted');
	}.property('post.isDownVoted'),
	init: function() {
		if(this.attrs.post.value.isCurrent) {
			this.bindKeyPress = Ember.run.bind(this, this.globalKeyPress);
			Ember.$(window).bind('keypress', this.bindKeyPress);
		}
		this._super.apply(this);
	},
	bindKeyPress: null,
	globalKeyPress: function(e) {
		if(!this.get('post')) {
			return;
		}
		var key = this.bindings.keyMap[e.keyCode];
		var functions = this.bindings.functions;
		if(key === functions.upVote.getKey()) {
			this.sendAction('upVote');
			if(this.get('post.isUpVoted')) {
				this.set('post.isUpVoted', false);
			} else {
				this.set('post.isUpVoted', true);
			}
			this.set('post.isDownVoted', false);
			return;
		}
		if(key === functions.downVote.getKey()) {
			this.sendAction('downVote');
			if(this.get('post.isDownVoted')) {
				this.set('post.isDownVoted', false);
			} else {
				this.set('post.isDownVoted', true);
			}
			this.set('post.isUpVoted', false);
			return;
		}
	},
});
