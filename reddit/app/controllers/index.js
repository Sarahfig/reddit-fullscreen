import Ember from 'ember';

export default Ember.Controller.extend({
  currentIndex: 0,
  previousIndex: function() {
	  return this.currentIndex - 1;
  },
  nextIndex: function() {
	  return this.currentIndex + 1;
  },
  list: function() {
	  var list = JSON.parse(JSON.stringify(this.get('model.list')));
	  var displayed = [];
	  if(list[this.previousIndex()]) {
		  displayed.push(list[this.previousIndex()]);
		  displayed[0].isPrevious = true;
	  }
	  displayed.push(list[this.currentIndex]);
	  displayed[displayed.length - 1].isCurrent = true;
	  if(list[this.nextIndex()]) {
		  displayed.push(list[this.nextIndex()]);
		  displayed[displayed.length - 1].isNext = true;
	  }
	  return displayed;
  }.property('model.list', 'currentIndex'),
  actions: {
	  nextPost: function() {
		  if(this.currentIndex < this.get('model.list').length - 1) {
			  this.set('currentIndex', this.currentIndex + 1);
		  }
	  },
	  previousPost: function() {
		  if(this.currentIndex) {
			  this.set('currentIndex', this.currentIndex - 1);
		  }
	  },
	  upVote: function() {
		  var list = this.get('model.list');
		  var current = this.get('currentIndex');
		  var post = null;
		  list.forEach(function(item, index) {
			  if(index === current) {
				  post = item;
			  }
		  });
		  if(post.isUpVoted) {
			  this.api.post.removeVote(post.name);
			  post.isUpVoted = false;
		  } else {
			  this.api.post.upVote(post.name);
			  post.isUpVoted = true;
		  }
		  post.isDownVoted = false;
	  },
	  downVote: function() {
		 var list = this.get('model.list');
		 var current = this.get('currentIndex');
		 var post = null;
		 list.forEach(function(item, index) {
			 if(index === current) {
				 post = item;
			 }
		 });
		  if(post.isDownVoted) {
			  this.api.post.removeVote(post.name);
			  post.isDownVoted = false;
		  } else {
			  this.api.post.upVote(post.name);
			  post.isDownVoted = true;
		  }
		 post.isUpVoted = false;
	  }
  }
});
