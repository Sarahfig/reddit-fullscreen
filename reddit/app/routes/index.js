import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    if(this.session.auth.needed()) {
      this.transitionTo('authenticate');
    }
  }
});
