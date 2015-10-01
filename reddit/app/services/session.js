import Ember from 'ember';

export default Ember.Service.extend({
  auth: {
    expires: function() {
      return localStorage.authExpires;
    },
    state: function() {
      return localStorage.authState;
    },
    token: function() {
      return localStorage.authToken;
    },
    needed: function() {
      if(!this.token() || this.expires() < new Date().getTime()) {
        return true;
      }
      return false;
    }
  },
  set: function(property, value) {
    localStorage[property] = value;
  }
});
