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
      return JSON.parse(localStorage.authToken);
    }
  }
});
