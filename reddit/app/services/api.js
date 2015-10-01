import Ember from 'ember';
import Ajax from 'reddit/utils/ajax';

export default Ember.Service.extend({
  auth: {
    getToken:function(code) {
      console.log(Ajax);
      return new Ajax().post('https://www.reddit.com/api/v1/access_token', 'grant_type=authorization_code&code=' + code + '&redirect_uri=http://localhost:4200/authorize', {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'VVotW8Dp6WU6-w:ZFvRllL6c8qm0hcgfRxlIKSLkTo'
        }
      });
    },
    refresh:null
  }
});
