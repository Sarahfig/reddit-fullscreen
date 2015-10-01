import Ember from 'ember';
import Ajax from 'reddit/utils/ajax';

export default Ember.Service.extend({
  auth: {
    getToken:function(code) {
      var data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:4200/authorize'
      };
      return new Ajax().post('https://ssl.reddit.com/api/v1/access_token', data, {
        headers: {
          'Authorization': 'Basic ZWE3iZH2TyAp8g:ZFvRllL6c8qm0hcgfRxlIKSLkTo'
        }
      });
    },
    refresh:null
  }
});
