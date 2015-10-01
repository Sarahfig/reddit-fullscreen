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
	  list[this.previousIndex()].isPrevious = true;
	  list[this.currentIndex].isCurrent = true;
	  list[this.nextIndex()].isNext = true;
	  return list;
  }.property('model.list')
});
