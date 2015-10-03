import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
		if(this.session.auth.needed()) {
			this.transitionTo('authenticate');
		}
	},
	model: function() {
		var self = this;
		return this.api.front.get().then(function(response) {
			var model = {};
			model.after = response.data.after;
			model.list = self.parse.listings(response.data.children);
			return model;
		});
	},
	actions: {
		self: this,
		getMore: function() {
			var after = this.get('context.after');
			var self = this;
			this.api.front.getMore(after).then(function(response) {
				var list = self.get('currentModel.list');
				var newStuff = self.parse.listings(response.data.children);
				var combined = list.concat(newStuff);
				self.set('currentModel.list', combined);
				console.log('got more shit!');
			});
		}
	}
});
