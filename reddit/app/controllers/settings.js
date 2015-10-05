import Ember from 'ember';

export default Ember.Controller.extend({
	init: function() {
		//console.log(this);
	},
	keymap: function() {
		var bindings = this.bindings.functions;
		var _bindings = [];
		Ember.$.each(bindings, function(index, item) {
			item.name = index;
			if(item.user() === 'default' || !item.user()) {
				item.value = item.default;
			} else {
				item.value = item.user();
			}
			item.update = function() {
				console.log('update');
			}.property('value');
			_bindings.push(item);
		});
		console.log('setkeymap', _bindings);
		return _bindings;
	}.property('bindings.functions'),
	keyOptions: function() {
		var options = this.bindings.keyMap;
		var _options = [];
		Ember.$.each(options, function(index, item) {
			_options.push(item);
		});
		return _options;
	}.property('bindings.keyMap')
});
