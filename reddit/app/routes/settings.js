import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
		if(this.session.auth.needed()) {
			localStorage.originalRoute = 'settings';
			this.transitionTo('authenticate');
		}
	},
	model: function() {
		var model = {foo:'bar'};

		return model;
	}
});
