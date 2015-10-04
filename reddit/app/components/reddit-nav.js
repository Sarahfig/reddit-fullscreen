import Ember from 'ember';

export default Ember.Component.extend({
	isHot:function() {
		return this.get('current') === 'hot';
	}.property('current'),
	isTop:function() {
		return this.get('current') === 'top';
	}.property('current')
});
