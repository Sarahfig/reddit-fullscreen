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
	  displayed.push(list[this.nextIndex()]);
	  displayed[displayed.length - 1].isNext = true;
	  return displayed;
  }.property('model.list', 'currentIndex'),
  actions: {
	  nextPost: function() {
		  this.set('currentIndex', this.currentIndex + 1);
	  },
	  previousPost: function() {
		  if(this.currentIndex) {
			  this.set('currentIndex', this.currentIndex - 1);
		  }
	  },
	  upVote: function(post) {
		  if(post.isUpVoted) {
			  this.api.post.removeVote(post.id).then(function(response) {
				  console.log('response', response);
				  post.isUpVoted = false;
			  });
		  } else {
			  this.api.post.upVote(post.id).then(function(response) {
				  console.log('response', response);
				  post.isUpVoted = true;
			  });
		  }
		  post.isDownVoted = false;
		  console.log('send upvote', post);
	  },
	  downVote: function(post) {
		  if(post.isDownVoted) {
			  this.api.post.removeVote(post.id).then(function() {
				  post.isDownVoted = false;
			  });
		  } else {
			  this.api.post.upVote(post.id).then(function() {
				  post.isDownVoted = true;
			  });
		  }
		  post.isUpVoted = false;
		  console.log('send downvote', post);
	  }
  }
});
