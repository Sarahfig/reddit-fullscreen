import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    if(!this.session.auth.token()) {
      this.transitionTo('authenticate');
    }
  }
});
