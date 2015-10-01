import Ember from 'ember';
import Ajax from 'reddit/utils/ajax';

var base = 'https://oauth.reddit.com/api/',
  token = function() {
    return 'Bearer ' + localStorage.authToken;
  };

export default Ember.Service.extend({
  account: {
    getMe: function() {
      return new Ajax().get(base + 'v1/me', null, {
        headers: {
          'Authorization': token()
        }
      });
    }
  }
});
