import Ember from 'ember';

export default Ember.Service.extend({
  auth: {
    error: function(){
      return localStorage.authError;
    },
    code: function() {
      return localStorage.authCode;
    },
    state: function() {
      return localStorage.authState;
    },
    token: function() {
      if(!localStorage.authToken) {
        return false;
      }
      return JSON.parse(localStorage.authToken);
    }
  },
  set: function(property, value) {
    localStorage[property] = value;
  }
});
