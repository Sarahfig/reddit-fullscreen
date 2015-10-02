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
	  console.log('run', this.currentIndex);
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
		  console.log('show next post', this.currentIndex, this.get('list'));
	  },
	  previousPost: function() {
		  this.set('currentIndex', this.currentIndex - 1);
		  console.log('show previous post', this.currentIndex);
	  }
  }
});
