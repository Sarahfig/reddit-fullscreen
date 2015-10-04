import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
		if(this.session.auth.needed()) {
			this.transitionTo('authenticate');
		}
	},
	model: function() {
		var self = this;
		var scope = this.session.account.preferences.topScope() || 'week';
		return this.api.top.get(scope).then(function(response) {
			var model = {};
			model.scope = scope;
			model.after = response.data.after;
			model.list = self.parse.listings(response.data.children);
			return model;
		});
	},
	actions: {
		self: this,
		getMore: function() {
			var after = this.get('context.after');
			var scope = this.get('context.scope');
			var self = this;
			this.api.top.getMore(after, scope).then(function(response) {
				var list = self.get('currentModel.list');
				var newStuff = self.parse.listings(response.data.children);
				var combined = list.concat(newStuff);
				self.set('currentModel.list', combined);
			});
		}
	}
});
