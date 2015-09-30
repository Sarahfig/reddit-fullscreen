import Ember from 'ember';

export default Ember.Service.extend({
  auth: {
    getToken:function(code) {
      return this.ajax.post('https://www.reddit.com/api/v1/access_token', 'grant_type=authorization_code&code=' + code + '&redirect_uri=http://localhost:4200/authorize');
    },
    refresh:null
  }
});
