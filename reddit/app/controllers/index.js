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
	  var list = this.get('model.list');
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
  }.property('model.list')
});
