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
  account: {
    user: function() {
      if(!localStorage.user) {
        return null;
      }
      return JSON.parse(localStorage.accountUser);
    }
  },
  set: function(property, value) {
    if(typeof value === 'object') {
      localStorage[property] = JSON.stringify(value);
    } else {
      localStorage[property] = value;
    }
  }
});
