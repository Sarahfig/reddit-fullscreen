import Ember from 'ember';

export default Ember.Component.extend({
	isHot:function() {
		console.log('isHot', this.get('current'));
		return this.get('current') === 'hot';
	}.property('current'),
	isTop:function() {
		return this.get('current') === 'top';
	}.property('current')
});
