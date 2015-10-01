import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
      user: this.session.account.user()
    };
  }
});
